package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"finplay/backend/database"
	"finplay/backend/handlers"
	"finplay/backend/middleware"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

// Estruturas para Groq API (mantidas do código anterior)
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type GroqRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type GroqResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
		Type    string `json:"type"`
	} `json:"error"`
}

type ChatRequest struct {
	Message string    `json:"message"`
	History []Message `json:"history"`
}

type ChatResponse struct {
	Response string `json:"response"`
	Error    string `json:"error,omitempty"`
}

var apiKey string

func main() {
	// Carrega variáveis de ambiente
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Aviso: arquivo .env não encontrado")
	}

	// API Key do Groq
	apiKey = os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		log.Fatal("❌ GROQ_API_KEY não configurada no arquivo .env")
	}

	// Conectar ao PostgreSQL
	if err := database.Connect(); err != nil {
		log.Fatal("❌ Erro ao conectar ao PostgreSQL:", err)
	}
	defer database.Close()

	log.Printf("✅ API Key carregada (primeiros 10 chars): %s...\n", apiKey[:min(10, len(apiKey))])

	// Configurar rotas
	mux := http.NewServeMux()

	// Rotas públicas (sem autenticação)
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/auth/register", handlers.HandleRegister)
	mux.HandleFunc("/api/auth/login", handlers.HandleLogin)
	mux.HandleFunc("/api/auth/logout", handlers.HandleLogout)
	mux.HandleFunc("/api/chat", handleChat)

	// Rotas protegidas (com autenticação)
	mux.HandleFunc("/api/auth/me", middleware.AuthMiddleware(handlers.HandleGetMe))
	mux.HandleFunc("/api/orders", middleware.AuthMiddleware(handlers.HandleCreateOrder))
	mux.HandleFunc("/api/orders/complete", middleware.AuthMiddleware(handlers.HandleCompleteOrder))
	mux.HandleFunc("/api/orders/history", middleware.AuthMiddleware(handlers.HandleGetOrderHistory))
	mux.HandleFunc("/api/orders/cancel", middleware.AuthMiddleware(handlers.HandleCancelOrder))

	// Configurar CORS
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            false,
	}).Handler(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\n🚀 Servidor rodando na porta %s\n", port)
	fmt.Printf("📡 Health check: http://localhost:%s/health\n", port)
	fmt.Printf("💬 Chat endpoint: http://localhost:%s/api/chat\n", port)
	fmt.Printf("🔐 Auth endpoints: http://localhost:%s/api/auth/*\n", port)
	fmt.Printf("🛒 Orders endpoints: http://localhost:%s/api/orders/*\n", port)
	fmt.Printf("🤖 Usando Groq API (llama-3.1-8b-instant)\n")
	fmt.Printf("🗄️  PostgreSQL conectado\n\n")

	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":   "ok",
		"database": "connected",
	})
}

func handleChat(w http.ResponseWriter, r *http.Request) {
	log.Printf("📨 Nova requisição: %s %s\n", r.Method, r.URL.Path)

	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("❌ Erro ao decodificar: %v\n", err)
		sendChatError(w, "Erro ao ler requisição", http.StatusBadRequest)
		return
	}

	log.Printf("💬 Mensagem: %s\n", req.Message)

	messages := []Message{
		{
			Role: "system",
			Content: `Você é um assistente virtual da loja "FinPlay". 
Suas funções:
1. Informar sobre produtos e catálogo
			1.1 o catálogo contém: Hamburguers
			esses sendo: Cheeseburguer, Vegano, Recheado, Gourmet, Picanha e Frango Grelhado.
				1.1.1 os Ingredientes, 
					Cheeseburguer: Pão, Hambúrguer bovino, Queijo cheddar, Alface, Tomate e Molho especial.
					Vegano:Pão integral, Hambúrguer de grão-de-bico, Alface, Tomate, Cebola roxa e Molho de tahine.
					Recheado: Pão brioche, Hambúrguer recheado com queijo, Bacon, Cebola caramelizada, Rúcula e Molho barbecue.
					Gormet: Pão australiano, Hambúrguer angus, Queijo brie, Cebola crispy, Rúcula, Geleia de pimenta.
					Picanha: Pão artesanal, Hambúrguer de picanha, Queijo provolone, Tomate, Alface e Maionese de alho.
					Frango Grelhado: Pão integral, Peito de frango grelhado, Queijo mussarela, Alface, Tomate e Molho caesar.
			1.2 o catálogo contém tambem: Bebidas
			essas sendo: Caipirinha, Negroni, Margarita, Água, Coca cola e Suco de Laranja
				1.2.1 os Ingredientes,
					Caipirinha: Cachaça, Limão, Açúcar e Gelo.
					Negroni: Gin, Vermute rosso, Campari e Laranja.
					Margarita: Tequila, Cointreau, Suco de limão, Sal e Gelo.
			1.3 por ultimo o catálogo contém: Sobremesas
			essas sendo: Pudim, Cheesecake, Sorbet, Mousse, Açaí e Pavê.
				1.3.1 os ingredientes,
					Pudim: Leite condensado, Leite, Ovos e Açúcar caramelizado.
					Cheesecake: Cream cheese, Biscoito triturado, Manteiga, Frutas vermelhas e Geleia.
					Sorbet: Limão, Água, Açúcar e Raspas de limão.
					Mousse: Polpa de maracujá, Creme de leite, Leite condensado e Gelatina.
					Açaí: Açaí puro.
					Pavê: Chocolate ao leite, Biscoito maisena, Leite, Creme de leite e Cacau em pó.

PRIORIDADE IMPORTANTE:	Caso perguntem algo que não tenha no catalogo, responda honestamente sempre e diga que não temos o produto, repeite sempre o que o catálogo oferece

2. Suporte ao cliente
3. Questões financeiras
4. Informações de entrega (20 minutos)

Seja educado, objetivo e prestativo. Responda em português do Brasil.`,
		},
	}

	messages = append(messages, req.History...)
	messages = append(messages, Message{
		Role:    "user",
		Content: req.Message,
	})

	log.Println("🤖 Chamando Groq API...")

	response, err := callGroqAPI(messages)
	if err != nil {
		log.Printf("❌ Erro: %v\n", err)
		sendChatError(w, "Erro ao processar mensagem", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Resposta recebida\n")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ChatResponse{Response: response})
}

func callGroqAPI(messages []Message) (string, error) {
	reqBody := GroqRequest{
		Model:    "llama-3.1-8b-instant",
		Messages: messages,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("❌ Erro API: %s\n", string(body))
		return "", fmt.Errorf("API erro %d: %s", resp.StatusCode, string(body))
	}

	var apiResp GroqResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		return "", err
	}

	if apiResp.Error != nil {
		return "", fmt.Errorf("erro: %s", apiResp.Error.Message)
	}

	if len(apiResp.Choices) == 0 {
		return "", fmt.Errorf("nenhuma resposta")
	}

	return apiResp.Choices[0].Message.Content, nil
}

func sendChatError(w http.ResponseWriter, message string, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ChatResponse{Error: message})
}
