# 🍋 Lemonade - E-commerce Backend API

A robust NestJS backend application for managing an e-commerce platform with products, variants, and orders. Built with TypeScript, PostgreSQL, and Docker for easy development and deployment.

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Node.js](https://nodejs.org/) (version 18+ for local development)

### Development Environment

```bash
# Clone the repository
git clone git@github.com:seyrls/lemonade.git
cd lemonade

# Copy environment variables
cp env.example .env

# Start all services with Docker
docker-compose up -d

# The API will be available at http://localhost:3000
```

### Local Development (Alternative)

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
npm run migration:run

# Start the application
npm run start:dev
```

### Bruno Collection

In the docs folder, there's a collect for all the APIs using [Bruno](https://www.usebruno.com/)

## 🏗️ Architecture & Design Choices

### Modular Structure

- **Admin Module**: Product and variant management for administrators
- **Customer Module**: Order processing and customer-facing APIs
- **Core Module**: Shared utilities, interceptors, and common functionality

### Database Design

- **Normalized Schema**: Separate tables for products, variants, and product-variants
- **Flexible Product System**: Products can have multiple variants with different prices
- **Audit Trail**: Created/updated timestamps on all entities
- **Soft Deletes**: Products and variants can be deactivated rather than deleted

### API Design Principles

- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Consistent Response Format**: All responses use the same structure
- **Input Validation**: DTOs with class-validator decorators
- **Error Handling**: Global exception filters with consistent error responses

### Security & Performance

- **TypeORM**: Efficient database queries with relationship loading
- **Transaction Support**: ACID compliance for order processing
- **Input Sanitization**: Validation and sanitization of all user inputs
- **Environment Configuration**: Secure configuration management

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Currently, the API runs without authentication for development purposes. In production, implement JWT or OAuth2 authentication.

---

## 🛍️ Admin APIs

### Products Management

#### Get All Products

```http
GET /admin/products
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "image_url": "https://example.com/tshirt.jpg",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Product by ID

```http
GET /admin/products/{id}
```

#### Create Product

```http
POST /admin/products
```

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "image_url": "https://example.com/image.jpg",
  "is_active": true
}
```

#### Update Product

```http
PATCH /admin/products/{id}
```

**Request Body:**

```json
{
  "name": "Updated Product Name",
  "description": "Updated description"
}
```

#### Upsert Product

```http
PUT /admin/products/{id}
```

#### Delete Product

```http
DELETE /admin/products/{id}
```

---

### Variants Management

#### Get All Variants

```http
GET /admin/variants
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Large",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Variant

```http
POST /admin/variants
```

**Request Body:**

```json
{
  "name": "Medium",
  "is_active": true
}
```

#### Update Variant

```http
PATCH /admin/variants/{id}
```

#### Delete Variant

```http
DELETE /admin/variants/{id}
```

---

### Product Variants Management

#### Add Variants to Product

```http
POST /admin/products/{productId}/variants
```

**Request Body:**

```json
[
  {
    "variant_id": "variant-uuid",
    "price": 29.99
  }
]
```

**Response:**

```json
[
  {
    "id": "uuid",
    "product_id": "product-uuid",
    "variant_id": "variant-uuid",
    "price": 29.99,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Update Product Variant

```http
PATCH /admin/products/{productId}/variants/{variantId}
```

**Request Body:**

```json
{
  "price": 34.99,
  "is_active": false
}
```

#### Delete Product Variant

```http
DELETE /admin/products/{productId}/variants/{variantId}
```

---

## 🛒 Customer APIs

### Order Management

#### Create Order

```http
POST /customer/orders
```

**Request Body:**

```json
{
  "customer_id": "user-uuid",
  "items": [
    {
      "product_variant_id": "product-variant-uuid",
      "quantity": 2
    }
  ]
}
```

**Response:**

```json
{
  "id": "order-uuid",
  "confirmation_number": 123456,
  "customer": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+1234567890"
  },
  "items": [
    {
      "id": "item-uuid",
      "product_variant": {
        "id": "product-variant-uuid",
        "price": 29.99,
        "product": {
          "name": "Classic T-Shirt"
        },
        "variant": {
          "name": "Large"
        }
      },
      "quantity": 2,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total_price": 59.98,
  "status": "pending",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### Get Order by Confirmation Number

```http
GET /customer/orders/{confirmationNumber}
```

---

## 🗄️ Database Schema

### Core Entities

#### Product

```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- description (TEXT)
- image_url (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Variant

```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### ProductVariant

```sql
- id (UUID, Primary Key)
- product_id (UUID, Foreign Key)
- variant_id (UUID, Foreign Key)
- price (DECIMAL)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Order

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- total_price (DECIMAL)
- status (ENUM: pending, confirmed, shipped, delivered, cancelled)
- confirmation_number (INTEGER, Unique)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### OrderItem

```sql
- id (UUID, Primary Key)
- order_id (UUID, Foreign Key)
- product_variant_id (UUID, Foreign Key)
- quantity (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### User

```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- email (VARCHAR, Unique)
- phone_number (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Coverage

- **Unit Tests**: 100% coverage for all services and controllers
- **E2E Tests**: Full API endpoint testing
- **Repository Tests**: Database operation testing
- **Utility Tests**: Helper function testing

---

## 🔧 Development Commands

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Database migrations
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

---

## 🌍 Environment Variables

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lemonade
DATABASE_USERNAME=lemonade_user
DATABASE_PASSWORD=lemonade_password

# Application
PORT=3000
NODE_ENV=development
```

---

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Database operations
docker-compose exec postgres psql -U lemonade_user -d lemonade
```

---

## 📁 Project Structure

```
src/
├── admin/                 # Admin-only APIs
│   ├── products/         # Product management
│   ├── variants/         # Variant management
│   └── product-variants/ # Product-variant relationships
├── customer/             # Customer-facing APIs
│   └── orders/          # Order processing
├── core/                 # Shared utilities
│   ├── interceptors/    # Response transformation
│   └── dto/            # Common DTOs
├── entities/            # Database models
└── migrations/          # Database migrations
```

---

## 🔒 Security Considerations

- Input validation on all endpoints
- SQL injection protection via TypeORM
- Environment variable configuration
- CORS configuration for production
- Rate limiting (to be implemented)

---

## 📝 License

This project is licensed under the MIT License.
