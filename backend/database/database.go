// Arquivo: backend/database/database.go
package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// Conectar ao banco de dados PostgreSQL
func Connect() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Valores padrão se não estiverem no .env
	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "5432"
	}
	if user == "" {
		user = "postgres"
	}
	if dbname == "" {
		dbname = "finplay_db"
	}

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("erro ao conectar ao banco: %v", err)
	}

	// Testar conexão
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("erro ao pingar banco: %v", err)
	}

	// Configurar pool de conexões
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)

	log.Println("✅ Conectado ao PostgreSQL com sucesso!")
	return nil
}

// Fechar conexão com o banco
func Close() {
	if DB != nil {
		DB.Close()
		log.Println("🔒 Conexão com PostgreSQL fechada")
	}
}
