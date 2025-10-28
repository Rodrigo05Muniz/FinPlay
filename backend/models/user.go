// Arquivo: backend/models/user.go
package models

import (
	"database/sql"
	"errors"
	"regexp"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           string     `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"` // Nunca retornar no JSON
	FullName     string     `json:"full_name"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	LastLogin    *time.Time `json:"last_login,omitempty"`
	IsActive     bool       `json:"is_active"`
}

type UserRegistration struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
}

type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Validar email
func ValidateEmail(email string) error {
	if email == "" {
		return errors.New("email é obrigatório")
	}

	// Regex para validar email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return errors.New("formato de email inválido")
	}

	// Validar provedores conhecidos
	providerRegex := regexp.MustCompile(`@(gmail|yahoo|hotmail|outlook|live|icloud|protonmail|aol)\.(com|com\.br|net|org)$`)
	if !providerRegex.MatchString(email) {
		return errors.New("provedor de email não reconhecido. Use Gmail, Yahoo, Hotmail, Outlook, etc.")
	}

	return nil
}

// Validar senha
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("senha deve ter no mínimo 8 caracteres")
	}
	return nil
}

// Hash da senha
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// Verificar senha
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Criar usuário no banco
func CreateUser(db *sql.DB, reg UserRegistration) (*User, error) {
	// Validações
	if err := ValidateEmail(reg.Email); err != nil {
		return nil, err
	}
	if err := ValidatePassword(reg.Password); err != nil {
		return nil, err
	}

	// Hash da senha
	hashedPassword, err := HashPassword(reg.Password)
	if err != nil {
		return nil, err
	}

	// Inserir no banco
	var user User
	query := `
		INSERT INTO users (email, password_hash, full_name)
		VALUES ($1, $2, $3)
		RETURNING id, email, full_name, created_at, updated_at, is_active
	`
	err = db.QueryRow(query, reg.Email, hashedPassword, reg.FullName).Scan(
		&user.ID, &user.Email, &user.FullName,
		&user.CreatedAt, &user.UpdatedAt, &user.IsActive,
	)

	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"users_email_key\"" {
			return nil, errors.New("email já cadastrado")
		}
		return nil, err
	}

	return &user, nil
}

// Buscar usuário por email
func GetUserByEmail(db *sql.DB, email string) (*User, error) {
	var user User
	query := `
		SELECT id, email, password_hash, full_name, created_at, updated_at, last_login, is_active
		FROM users
		WHERE email = $1 AND is_active = true
	`
	err := db.QueryRow(query, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FullName,
		&user.CreatedAt, &user.UpdatedAt, &user.LastLogin, &user.IsActive,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("usuário não encontrado")
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Atualizar último login
func UpdateLastLogin(db *sql.DB, userID string) error {
	query := `UPDATE users SET last_login = $1 WHERE id = $2`
	_, err := db.Exec(query, time.Now(), userID)
	return err
}
