// Arquivo: backend/handlers/auth.go
package handlers

import (
	"encoding/json"
	"finplay/backend/database"
	"finplay/backend/middleware"
	"finplay/backend/models"
	"log"
	"net/http"
)

type AuthResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// POST /api/auth/register
func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var reg models.UserRegistration
	if err := json.NewDecoder(r.Body).Decode(&reg); err != nil {
		sendError(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	log.Printf("📝 Tentativa de registro: %s", reg.Email)

	// Criar usuário
	user, err := models.CreateUser(database.DB, reg)
	if err != nil {
		log.Printf("❌ Erro no registro: %v", err)
		sendError(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Gerar token
	token, err := middleware.GenerateToken(user.ID, user.Email)
	if err != nil {
		sendError(w, "Erro ao gerar token", http.StatusInternalServerError)
		return
	}

	// Definir cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // true em produção com HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400, // 24 horas
	})

	log.Printf("✅ Usuário registrado: %s", user.Email)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token: token,
		User:  *user,
	})
}

// POST /api/auth/login
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var login models.UserLogin
	if err := json.NewDecoder(r.Body).Decode(&login); err != nil {
		sendError(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	log.Printf("🔐 Tentativa de login: %s", login.Email)

	// Buscar usuário
	user, err := models.GetUserByEmail(database.DB, login.Email)
	if err != nil {
		log.Printf("❌ Usuário não encontrado: %s", login.Email)
		sendError(w, "Email ou senha incorretos", http.StatusUnauthorized)
		return
	}

	// Verificar senha
	if !models.CheckPassword(login.Password, user.PasswordHash) {
		log.Printf("❌ Senha incorreta para: %s", login.Email)
		sendError(w, "Email ou senha incorretos", http.StatusUnauthorized)
		return
	}

	// Atualizar último login
	models.UpdateLastLogin(database.DB, user.ID)

	// Gerar token
	token, err := middleware.GenerateToken(user.ID, user.Email)
	if err != nil {
		sendError(w, "Erro ao gerar token", http.StatusInternalServerError)
		return
	}

	// Definir cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   86400,
	})

	log.Printf("✅ Login bem-sucedido: %s", user.Email)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{
		Token: token,
		User:  *user,
	})
}

// POST /api/auth/logout
func HandleLogout(w http.ResponseWriter, r *http.Request) {
	// Remover cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
	})

	log.Println("👋 Usuário desconectado")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Logout realizado com sucesso"})
}

// GET /api/auth/me - Retorna usuário logado
func HandleGetMe(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		sendError(w, "Não autenticado", http.StatusUnauthorized)
		return
	}

	user, err := models.GetUserByEmail(database.DB, claims.Email)
	if err != nil {
		sendError(w, "Usuário não encontrado", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func sendError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}
