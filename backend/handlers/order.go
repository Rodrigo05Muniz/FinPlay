// Arquivo: backend/handlers/orders.go
package handlers

import (
	"encoding/json"
	"hello-world-chatbot/backend/database"
	"hello-world-chatbot/backend/middleware"
	"hello-world-chatbot/backend/models"
	"log"
	"net/http"
)

// POST /api/orders - Criar novo pedido
func HandleCreateOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		sendError(w, "Não autenticado", http.StatusUnauthorized)
		return
	}

	var req models.CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendError(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	if len(req.Items) == 0 {
		sendError(w, "Pedido deve conter pelo menos um item", http.StatusBadRequest)
		return
	}

	log.Printf("🛒 Criando pedido para usuário: %s", claims.Email)

	order, err := models.CreateOrder(database.DB, claims.UserID, req.Items, req.Notes)
	if err != nil {
		log.Printf("❌ Erro ao criar pedido: %v", err)
		sendError(w, "Erro ao criar pedido", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Pedido criado: %s (%d itens)", order.ID, order.TotalItems)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(order)
}

// POST /api/orders/:id/complete - Finalizar pedido
func HandleCompleteOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		sendError(w, "Não autenticado", http.StatusUnauthorized)
		return
	}

	// Extrair ID do pedido da URL (simplificado)
	orderID := r.URL.Query().Get("id")
	if orderID == "" {
		sendError(w, "ID do pedido é obrigatório", http.StatusBadRequest)
		return
	}

	log.Printf("✅ Finalizando pedido: %s", orderID)

	err := models.CompleteOrder(database.DB, orderID, claims.UserID)
	if err != nil {
		log.Printf("❌ Erro ao finalizar pedido: %v", err)
		sendError(w, "Erro ao finalizar pedido", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Pedido finalizado: %s", orderID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Pedido finalizado com sucesso"})
}

// GET /api/orders/history - Histórico de pedidos do usuário
func HandleGetOrderHistory(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		sendError(w, "Não autenticado", http.StatusUnauthorized)
		return
	}

	log.Printf("📜 Buscando histórico de pedidos: %s", claims.Email)

	orders, err := models.GetUserOrderHistory(database.DB, claims.UserID)
	if err != nil {
		log.Printf("❌ Erro ao buscar histórico: %v", err)
		sendError(w, "Erro ao buscar histórico", http.StatusInternalServerError)
		return
	}

	if orders == nil {
		orders = []models.Order{} // Retornar array vazio ao invés de null
	}

	log.Printf("✅ Histórico encontrado: %d pedidos", len(orders))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

// POST /api/orders/:id/cancel - Cancelar pedido
func HandleCancelOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		sendError(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		sendError(w, "Não autenticado", http.StatusUnauthorized)
		return
	}

	orderID := r.URL.Query().Get("id")
	if orderID == "" {
		sendError(w, "ID do pedido é obrigatório", http.StatusBadRequest)
		return
	}

	log.Printf("❌ Cancelando pedido: %s", orderID)

	err := models.CancelOrder(database.DB, orderID, claims.UserID)
	if err != nil {
		log.Printf("❌ Erro ao cancelar pedido: %v", err)
		sendError(w, "Erro ao cancelar pedido", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Pedido cancelado: %s", orderID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Pedido cancelado com sucesso"})
}
