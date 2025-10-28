// Arquivo: backend/models/order.go
package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Order struct {
	ID          string      `json:"id"`
	UserID      string      `json:"user_id"`
	Status      string      `json:"status"`
	TotalItems  int         `json:"total_items"`
	CreatedAt   time.Time   `json:"created_at"`
	CompletedAt *time.Time  `json:"completed_at,omitempty"`
	Notes       string      `json:"notes,omitempty"`
	Items       []OrderItem `json:"items"`
}

type OrderItem struct {
	ID              string  `json:"id"`
	OrderID         string  `json:"order_id"`
	ProductName     string  `json:"product_name"`
	ProductCategory string  `json:"product_category"`
	Quantity        int     `json:"quantity"`
	Price           float64 `json:"price,omitempty"`
	Ingredients     string  `json:"ingredients,omitempty"`
}

type CreateOrderRequest struct {
	Items []OrderItem `json:"items"`
	Notes string      `json:"notes"`
}

// Criar novo pedido
func CreateOrder(db *sql.DB, userID string, items []OrderItem, notes string) (*Order, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	// Inserir pedido
	var order Order
	query := `
		INSERT INTO orders (user_id, status, total_items, notes)
		VALUES ($1, $2, $3, $4)
		RETURNING id, user_id, status, total_items, created_at, notes
	`
	err = tx.QueryRow(query, userID, "pending", len(items), notes).Scan(
		&order.ID, &order.UserID, &order.Status, &order.TotalItems,
		&order.CreatedAt, &order.Notes,
	)
	if err != nil {
		return nil, err
	}

	// Inserir itens do pedido
	itemQuery := `
		INSERT INTO order_items (order_id, product_name, product_category, quantity, ingredients)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	order.Items = make([]OrderItem, 0, len(items))
	for _, item := range items {
		var itemID string
		ingredientsJSON, _ := json.Marshal(item.Ingredients)

		err = tx.QueryRow(itemQuery,
			order.ID, item.ProductName, item.ProductCategory,
			item.Quantity, string(ingredientsJSON),
		).Scan(&itemID)

		if err != nil {
			return nil, err
		}

		item.ID = itemID
		item.OrderID = order.ID
		order.Items = append(order.Items, item)
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	return &order, nil
}

// Finalizar pedido
func CompleteOrder(db *sql.DB, orderID, userID string) error {
	query := `
		UPDATE orders
		SET status = 'completed', completed_at = $1
		WHERE id = $2 AND user_id = $3 AND status = 'pending'
	`
	result, err := db.Exec(query, time.Now(), orderID, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// Buscar histórico de pedidos do usuário
func GetUserOrderHistory(db *sql.DB, userID string) ([]Order, error) {
	query := `
		SELECT o.id, o.user_id, o.status, o.total_items, o.created_at, o.completed_at, o.notes
		FROM orders o
		WHERE o.user_id = $1 AND o.status = 'completed'
		ORDER BY o.completed_at DESC
	`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var order Order
		err := rows.Scan(
			&order.ID, &order.UserID, &order.Status, &order.TotalItems,
			&order.CreatedAt, &order.CompletedAt, &order.Notes,
		)
		if err != nil {
			return nil, err
		}

		// Buscar itens do pedido
		items, err := GetOrderItems(db, order.ID)
		if err != nil {
			return nil, err
		}
		order.Items = items

		orders = append(orders, order)
	}

	return orders, nil
}

// Buscar itens de um pedido
func GetOrderItems(db *sql.DB, orderID string) ([]OrderItem, error) {
	query := `
		SELECT id, order_id, product_name, product_category, quantity, ingredients
		FROM order_items
		WHERE order_id = $1
	`

	rows, err := db.Query(query, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []OrderItem
	for rows.Next() {
		var item OrderItem
		err := rows.Scan(
			&item.ID, &item.OrderID, &item.ProductName,
			&item.ProductCategory, &item.Quantity, &item.Ingredients,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

// Cancelar pedido (apenas se pending)
func CancelOrder(db *sql.DB, orderID, userID string) error {
	query := `
		UPDATE orders
		SET status = 'cancelled'
		WHERE id = $1 AND user_id = $2 AND status = 'pending'
	`
	result, err := db.Exec(query, orderID, userID)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}

	return nil
}
