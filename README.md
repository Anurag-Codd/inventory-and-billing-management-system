# Business Management System API

## Overview
This is a Node.js/Express REST API for a business management system that handles authentication, client management, product management, transaction management, and transaction reporting. It is built to provide a robust backend for managing business operations efficiently.

## Base URL
`http://localhost:5000/api/v1`

## Authentication
The API uses JSON Web Tokens (JWT) for authentication, utilizing both access tokens and refresh tokens. Access tokens are sent in request headers, while refresh tokens are stored as HTTP-only cookies for enhanced security.

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

#### Register User
**POST** `/api/v1/auth/register`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "username": "admin123",
  "password": "password123"
}
```

**Validation:**
- All fields are required
- Email must be in a valid format
- Password must be at least 8 characters
- Email and username must be unique

**Response (201):**
```json
{
  "message": "User registration successfull",
  "user": {
    "_id": "user_id",
    "email": "admin@example.com",
    "username": "admin123",
    "token": "jwt_access_token"
  }
}
```

#### Login User
**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com", // or username
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successfull",
  "user": {
    "_id": "user_id",
    "email": "admin@example.com",
    "username": "admin123"
  },
  "token": "jwt_access_token"
}
```

#### Refresh Token
**GET** `/api/v1/auth/refresh`

**Requirements:**
- Refresh token cookie must be present

**Response (200):**
```json
{
  "message": "Access token refreshed",
  "token": "new_jwt_access_token"
}
```

#### Logout
**GET** `/api/v1/auth/logout`

**Response (200):**
```json
{
  "message": "Logout successfull"
}
```

### Client Routes (`/api/v1/client`)
*All client routes require authentication via `Authorization: Bearer <access_token>` header.*

#### Get All Clients
**GET** `/api/v1/client/`

**Response (200):**
```json
{
  "message": "clents fetched Successfully",
  "clients": [
    {
      "_id": "client_id",
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com",
      "address": "123 Main St",
      "type": "customer",
      "businessId": "business_id"
    }
  ]
}
```

#### Search Clients
**GET** `/api/v1/client/search?q=search_term`

**Query Parameters:**
- `q` (required): Search query string

**Response (200):**
```json
{
  "message": "Query fetched",
  "clients": [...]
}
```

#### Create Client
**POST** `/api/v1/client/create`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com", // optional
  "address": "123 Main St", // optional
  "type": "customer" // required
}
```

**Response (201):**
```json
{
  "message": "Client Created"
}
```

#### Update Client
**PATCH** `/api/v1/client/update/:id`

**Request Body:**
```json
{
  "phone": "0987654321", // optional
  "email": "newemail@example.com", // optional
  "address": "456 New St" // optional
}
```

**Response (200):**
```json
{
  "message": "Client data updated"
}
```

#### Delete Client
**DELETE** `/api/v1/client/delete/:id`

**Response (200):**
```json
{
  "message": "client data is deleted"
}
```

### Product Routes (`/api/v1/product`)
*All product routes require authentication via `Authorization: Bearer <access_token>` header.*

#### Get All Products
**GET** `/api/v1/product/`

**Response (200):**
```json
{
  "message": "Products fetched successfully",
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "stock": 50,
      "category": "electronics",
      "businessId": "business_id"
    }
  ]
}
```

#### Search Products
**GET** `/api/v1/product/search?q=search_term`

**Query Parameters:**
- `q` (required): Search query string

**Response (200):**
```json
{
  "message": "Query fetched",
  "products": [...]
}
```

#### Create Product
**POST** `/api/v1/product/create`

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "category": "electronics"
}
```

**Validation:**
- All fields are required
- Price must be greater than 0
- Stock cannot be negative

**Response (201):**
```json
{
  "message": "Product added",
  "product": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "category": "electronics",
    "businessId": "business_id"
  }
}
```

#### Update Product
**PATCH** `/api/v1/product/update/:id`

**Request Body:**
```json
{
  "name": "Updated Name", // optional
  "description": "Updated description", // optional
  "price": 89.99 // optional
}
```

**Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": {...}
}
```

#### Delete Product
**DELETE** `/api/v1/product/delete/:id`

**Response (200):**
```json
{
  "message": "Product deleted"
}
```

#### Track Stock
**POST** `/api/v1/product/track`

**Request Body:**
```json
{
  "increment": 10, // optional
  "decrement": 5   // optional
}
```

**Response (200):**
```json
{
  "message": "Stock quantity updated"
}
```

### Transaction Routes (`/api/v1/transaction`)
*All transaction routes require authentication via `Authorization: Bearer <access_token>` header.*

#### Create Transaction
**POST** `/api/v1/transaction/create`

**Request Body:**
```json
{
  "type": "sale", // or "purchase"
  "customerId": "customer_id", // required for sale
  "vendorId": "vendor_id", // required for purchase
  "products": [
    {
      "productId": "product_id",
      "quantity": 5,
      "price": 99.99
    }
  ],
  "date": "2023-01-01" // optional, defaults to current date if not provided
}
```

**Validation:**
- `type` is required and must be either "sale" or "purchase"
- `products` is required and must be a non-empty array
- `customerId` is required for `type: "sale"` and must correspond to a valid customer
- `vendorId` is required for `type: "purchase"` and must correspond to a valid vendor
- All `productId`s must exist and belong to the user's business
- For sales, each product's stock must be sufficient to cover the requested `quantity`
- All fields in `products` (`productId`, `quantity`, `price`) are required

**Response (200):**
```json
{
  "message": "sale recorded successfully" // or "purchase recorded successfully"
}
```

**Error Responses:**
- **400**: Bad Request (e.g., missing required fields, invalid `customerId`/`vendorId`, insufficient stock, or invalid products)
- **500**: Internal Server Error (e.g., database errors)

### Report Routes (`/api/v1/report`)
*All report routes require authentication via `Authorization: Bearer <access_token>` header.*

#### Search Transactions
**GET** `/api/v1/report/search?type=sale&from=2023-01-01&to=2023-12-31`

**Query Parameters:**
- `type` (optional): Transaction type ("sale" or "purchase")
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)

**Response (200):**
```json
{
  "message": "Search result",
  "transactions": [...],
  "count": 25
}
```

#### Get Transaction History
**GET** `/api/v1/report/:id`

**Parameters:**
- `id`: Client/Vendor ID

**Response (200):**
```json
{
  "message": "Transaction fetch succussfully",
  "transactions": [...],
  "summary": {
    "sale": {
      "count": 10,
      "amount": 1000.50
    },
    "purchase": {
      "count": 5,
      "amount": 500.25
    }
  }
}
```

## Error Responses
**Common Error Codes:**
- **400**: Bad Request (validation errors, missing fields)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (invalid refresh token)
- **404**: Not Found (resource not found)
- **500**: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message describing what went wrong"
}
```

## Authentication Flow
1. **Register/Login**: Obtain an access token and refresh token (stored as an HTTP-only cookie).
2. **API Requests**: Include the `Authorization: Bearer <access_token>` header in requests.
3. **Token Refresh**: When the access token expires, use the `/auth/refresh` endpoint to obtain a new access token.
4. **Logout**: Clear the refresh token cookie using the `/auth/logout` endpoint.

## Notes
- The API uses MongoDB for data storage.
- Text search is implemented for clients and products.
- All authenticated routes verify the user's business ownership.
- CORS is enabled for all origins.
- Passwords are hashed using bcrypt.
- Stock tracking supports both increment and decrement operations.
- Transactions automatically update product stock (decrement for sales, increment for purchases).

## Installation
To set up the API locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/business-management-system-api.git
   cd business-management-system-api
   ```

2. **Install Dependencies**
   Ensure you have Node.js and npm installed, then run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```

4. **Start the Server**
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000/api/v1`.

## Usage
To interact with the API, you can use tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/). Below is an example of how to create a transaction using cURL:

```bash
curl -X POST http://localhost:5000/api/v1/transaction/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <jwt_access_token>" \
-d '{
  "type": "sale",
  "customerId": "customer_id",
  "products": [
    {
      "productId": "product_id",
      "quantity": 5,
      "price": 99.99
    }
  ],
  "date": "2023-01-01"
}'
```

For authenticated routes, include the JWT access token in the `Authorization` header:

```bash
curl -X GET http://localhost:5000/api/v1/client/ \
-H "Authorization: Bearer <jwt_access_token>"
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull_request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
