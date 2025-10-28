// Arquivo: backend/middleware/auth.go
package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

type contextKey string

const UserContextKey contextKey = "user"

// Gerar JWT token
func GenerateToken(userID, email string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "seu-secret-super-secreto-aqui" // MUDAR EM PRODUÇÃO
	}

	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// Verificar JWT token
func VerifyToken(tokenString string) (*Claims, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "seu-secret-super-secreto-aqui"
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

// Middleware de autenticação
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extrair token do header Authorization ou cookie
		var tokenString string

		// Tentar pegar do header primeiro
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && parts[0] == "Bearer" {
				tokenString = parts[1]
			}
		}

		// Se não encontrou no header, tentar cookie
		if tokenString == "" {
			cookie, err := r.Cookie("auth_token")
			if err == nil {
				tokenString = cookie.Value
			}
		}

		if tokenString == "" {
			sendError(w, "Token não fornecido", http.StatusUnauthorized)
			return
		}

		// Verificar token
		claims, err := VerifyToken(tokenString)
		if err != nil {
			sendError(w, "Token inválido ou expirado", http.StatusUnauthorized)
			return
		}

		// Adicionar claims ao contexto
		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Extrair usuário do contexto
func GetUserFromContext(r *http.Request) (*Claims, bool) {
	claims, ok := r.Context().Value(UserContextKey).(*Claims)
	return claims, ok
}

// Enviar erro JSON
func sendError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}
