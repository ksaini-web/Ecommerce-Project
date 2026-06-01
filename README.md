# Shopcart

## Overview

Shopcart is a full-stack e-commerce application with separate customer and seller experiences. The frontend is built with React and Vite, while the backend uses Spring Boot, Spring Security, JWT authentication, MySQL, Razorpay payments, and Cloudinary image hosting. The application supports product browsing, cart management, checkout, order history, seller product management, dashboard metrics, image upload, and QR-based order display in the UI.

## Key Features

### User Panel

- User registration with name, email, phone, and password validation.
- User login with JWT-based authentication.
- Protected customer routes for cart, checkout, order history, and order success pages.
- Product catalog browsing from the backend product API.
- Client-side product search in the navbar and backend search API support.
- Product details page with image, category, description, stock, and price.
- Add to cart from product details.
- Cart page with item listing, quantity updates, item removal, subtotal, and total.
- Razorpay checkout integration.
- Order history page for authenticated users.
- Order success page with order details and QR code display.
- Account menu with order history and logout.

### Seller Panel

- Seller registration with seller name, business name, email, phone, password, and address.
- Seller login with JWT-based authentication.
- Protected seller routes for dashboard, analytics, add product, and product editing.
- Product management from the seller dashboard.
- Add product with title, description, price, stock, category, image URL, and optional image upload.
- Update product details and product image.
- Delete products.
- Cloudinary-backed product image upload.
- Inventory visibility through stock fields on product listings and seller tables.
- Seller dashboard metrics for total revenue, total orders, and total products.
- Seller analytics page for revenue, product, order, recent order, and successful payment summaries.
- Recent order monitoring on the seller dashboard.
- QR code rendering for recent seller orders in the frontend.

### Product Features

- Product catalog with public list and detail endpoints.
- Product metadata: title, description, price, discount percentage, rating, stock, brand, category, thumbnail, and image JSON string.
- Category filtering endpoint on the backend.
- Search endpoint using case-insensitive product title matching.
- Ratings and discounts are present in the product model and create DTO.
- Product images are supported through thumbnail URLs and a JSON image field.
- Product stock is stored and displayed as inventory data.
- QR code access is rendered in the frontend from order data.

The current implementation does not include a separate downloadable product resource system or non-image file attachment API. Product media upload is implemented for images through Cloudinary.

### Payment Features

- Razorpay Java SDK integration on the backend.
- Razorpay Checkout script loaded in the frontend.
- Backend order creation based on cart items and current product prices.
- Pending order records created before checkout confirmation.
- Payment verification endpoint updates payment status to `SUCCESS`.
- Payment status is stored on each order.

### Media Features

- Cloudinary integration through a Spring Boot configuration bean.
- Seller-only image upload endpoint using multipart form data.
- Uploaded images are stored under the `ecommerce/products` Cloudinary folder.
- Uploaded secure URLs are saved as product thumbnails by the frontend product forms.

## Tech Stack

### Frontend

| Technology | Usage |
| --- | --- |
| React 19 | UI development |
| Vite 7 | Frontend build tool and dev server |
| React Router DOM 7 | Client-side routing and protected pages |
| Axios | API requests |
| Tailwind CSS 4 | Utility styling |
| Framer Motion | UI animation dependency |
| React Icons | Icon components |
| React QR Code | QR rendering for order data |
| React Slick / Slick Carousel | Carousel dependencies |
| ESLint | Frontend linting |

### Backend

| Technology | Usage |
| --- | --- |
| Java 17 | Backend runtime |
| Spring Boot 3.3.5 | Application framework |
| Spring Web | REST APIs |
| Spring Security | Authentication and authorization |
| Spring Data JPA | ORM and repository layer |
| Jakarta Validation | Request validation |
| Lombok | Boilerplate reduction |
| JJWT | JWT generation and parsing |
| Maven | Build and dependency management |
| Docker | Backend container build |

### Database

| Technology | Usage |
| --- | --- |
| MySQL | Relational database |
| Hibernate / JPA | Entity mapping and schema updates |

### Third-Party Services

| Service | Usage |
| --- | --- |
| Razorpay | Checkout order creation and payment confirmation |
| Cloudinary | Product image upload and hosted asset URLs |

## Architecture

```text
React Frontend
    |
    | Axios API layer with JWT Authorization header
    v
Spring Boot REST API
    |
    | Controllers -> Services -> Repositories
    v
MySQL Database
```

The frontend stores authenticated user and seller sessions in `localStorage`. Axios attaches the user token or seller token to protected API requests. The Spring Boot backend validates JWTs through a `OncePerRequestFilter`, assigns role-based authorities, and protects user, seller, cart, order, payment, product write, and upload routes through Spring Security.

Public product read APIs are available without authentication. Product creation, updates, deletion, image upload, and seller dashboard APIs require the `SELLER` role. Cart, order, and payment APIs require the `USER` role.

## Authentication Flow

1. A user or seller submits login credentials.
2. The backend validates the account using BCrypt password matching.
3. `JwtService` generates a JWT containing the account email as the subject and a `role` claim of `USER` or `SELLER`.
4. The frontend stores user tokens as `token` and seller tokens as `sellerToken`.
5. Axios adds `Authorization: Bearer <token>` to protected requests.
6. `JwtFilter` extracts the token, validates it, reads the email and role, and registers the authenticated principal in Spring Security.
7. `SecurityConfig` enforces role-based authorization for protected API groups.

## Payment Flow

```text
Cart -> Backend Payment Order -> Razorpay Checkout -> Payment Verification -> Order Confirmation
```

1. The user reviews cart items on the cart page.
2. The frontend sends cart product IDs and quantities to `POST /api/payment/create-order`.
3. The backend recalculates the total from database product prices.
4. Razorpay creates an order in INR.
5. The backend creates one or more pending `Order` records with the Razorpay order ID.
6. The frontend opens Razorpay Checkout using the returned key, amount, currency, and order ID.
7. Razorpay returns payment ID, order ID, and signature to the frontend handler.
8. The frontend calls `POST /api/payment/verify`.
9. The backend checks that the internal order belongs to the Razorpay order ID, stores Razorpay payment details, and marks the order as `SUCCESS`.
10. The frontend redirects to the order success page and renders a QR code from order data.

## Database Design

| Entity | Purpose | Relationships |
| --- | --- | --- |
| `User` | Stores customer account data: name, email, phone, encrypted password, and creation time. | One user can have many `CartItem` records and many `Order` records. |
| `Seller` | Stores seller profile data: seller name, business name, email, phone, encrypted password, address, status, and creation time. | One seller can own many `Product` records and receive many `Order` records. |
| `Product` | Stores catalog and inventory data, including price, discount, rating, stock, brand, category, thumbnail, and image metadata. | Many products belong to one `Seller`; products can appear in cart items and orders. |
| `CartItem` | Stores a user's selected product and quantity. | Many cart items belong to one `User`; each cart item references one `Product`. A unique constraint prevents duplicate user-product rows. |
| `Order` | Stores purchased product records, quantity, total price, Razorpay IDs, payment status, and creation time. | Each order references a `User`, `Product`, and `Seller`. |
| `SellerWallet` | Stores a seller wallet balance. | One-to-one relationship with `Seller`. No controller or service currently uses this entity. |

## API Documentation

### Authentication APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/user/signup` | Public | Register a customer account. |
| `POST` | `/api/auth/user/login` | Public | Login a customer and return JWT auth data. |
| `POST` | `/api/auth/seller/signup` | Public | Register a seller account. |
| `POST` | `/api/auth/seller/login` | Public | Login a seller and return JWT auth data. |

### Product APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | Public | Get all products. |
| `GET` | `/api/products/{productId}` | Public | Get product details by ID. |
| `GET` | `/api/products/search?keyword={keyword}` | Public | Search products by title. |
| `GET` | `/api/products/category/{category}` | Public | Get products by category. |
| `POST` | `/api/products` | Seller | Add a product. |
| `PUT` | `/api/products/{productId}` | Seller | Update a product. |
| `DELETE` | `/api/products/{productId}` | Seller | Delete a product. |
| `GET` | `/api/products/seller/{sellerId}/analytics` | Seller | Get cart-based seller product analytics. |

### Cart APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/cart` | User | Add a product to cart or increase quantity for an existing item. |
| `GET` | `/api/cart/user/{userId}` | User | Get cart items for a user. |
| `PUT` | `/api/cart/{cartItemId}` | User | Update cart item quantity. |
| `DELETE` | `/api/cart/{cartItemId}` | User | Remove an item from cart. |

### Payment APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/payment/create-order` | User | Create Razorpay order and pending database order records. |
| `POST` | `/api/payment/verify` | User | Store Razorpay payment details and mark the order successful. |

### Upload APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/upload/image` | Seller | Upload a product image to Cloudinary and return the secure URL. |

### Seller APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/seller/dashboard` | Seller | Get total products, total orders, and successful-order revenue for the authenticated seller. |
| `GET` | `/api/seller/analytics` | Seller | Get total orders, total revenue, product count, successful payment count, and recent orders. |

### Order APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/orders/me` | User | Get orders for the authenticated user. |
| `GET` | `/api/orders/user/{userId}` | User | Get orders by user ID. |
| `GET` | `/api/orders/{orderId}` | User | Get order by ID. |
| `GET` | `/api/orders/seller/{sellerId}` | Seller | Get orders for a seller. |

### Health API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Backend health check. |

## Project Structure

### Frontend

```text
.
|-- index.html
|-- package.json
|-- vite.config.js
|-- tailwind.config.js
|-- src
|   |-- api
|   |   |-- axiosInstance.js
|   |   |-- authService.js
|   |   |-- cartService.js
|   |   |-- productService.js
|   |   |-- sellerService.js
|   |   `-- offerService.js
|   |-- assets
|   |   |-- payment
|   |   |   `-- payment.js
|   |   `-- Home.jsx
|   |-- components
|   |   |-- Alert.jsx
|   |   |-- CartIcon.jsx
|   |   |-- LoadingSpinner.jsx
|   |   |-- Navbar.jsx
|   |   |-- ProductCard.jsx
|   |   `-- ProtectedRoute.jsx
|   |-- context
|   |   |-- AuthContext.jsx
|   |   `-- CartContext.jsx
|   |-- hooks
|   |   |-- useAuth.js
|   |   `-- useCart.js
|   |-- pages
|   |   |-- auth
|   |   |-- cart
|   |   |-- orders
|   |   |-- products
|   |   `-- seller
|   |-- utils
|   |   `-- validators.js
|   |-- App.jsx
|   `-- main.jsx
`-- public
```

### Backend

```text
ecommerce-backend
|-- Dockerfile
|-- pom.xml
|-- mvnw
|-- mvnw.cmd
`-- src
    |-- main
    |   |-- java/com/ecommerce/ecommerce_backend
    |   |   |-- config
    |   |   |-- controller
    |   |   |-- dto
    |   |   |-- entity
    |   |   |-- exception
    |   |   |-- repository
    |   |   |-- service
    |   |   `-- EcommerceBackendApplication.java
    |   `-- resources
    |       `-- application.properties
    `-- test
```

## Installation Guide

### Backend Setup

```bash
cd ecommerce-backend
./mvnw clean install
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd ecommerce-backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8080` by default.

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend runs on the Vite dev server, typically `http://localhost:5173`.

### Database Setup

1. Install and start MySQL.
2. Create the database:

```sql
CREATE DATABASE ecommerce;
```

3. Configure database credentials through environment variables or `application.properties`.
4. Start the backend. Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`, so tables are created or updated automatically from the JPA entities.

## Environment Variables

### Backend

| Variable | Purpose | Default in `application.properties` |
| --- | --- | --- |
| `PORT` | Backend server port | `8080` |
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/ecommerce` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `root` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | Test key fallback is present |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | Test secret fallback is present |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Development fallback is present |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Development fallback is present |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Development fallback is present |
| `JWT_SECRET` | JWT signing secret | Development fallback is present |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |

For production, replace all fallback secrets with secure environment variables.

### Frontend

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL for the Spring Boot API | `http://localhost:8080` |
| `VITE_RAZORPAY_KEY_ID` | Optional Razorpay Checkout key fallback used by the frontend | Backend response key is preferred |

## Screenshots

![Home](screenshots/home.png)

![Products](screenshots/products.png)

![Product Details](screenshots/product-details.png)

![Cart](screenshots/cart.png)

![Checkout](screenshots/checkout.png)

![Payment](screenshots/payment.png)

![Seller Dashboard](screenshots/seller-dashboard.png)

![Seller Analytics](screenshots/seller-analytics.png)

![QR Code](screenshots/qr-code.png)

![File Upload](screenshots/file-upload.png)

## Future Improvements

- Add signature verification using Razorpay's expected HMAC validation before marking payments successful.
- Add seller ownership checks for product update and delete operations.
- Clear purchased cart items after successful payment.
- Add dedicated downloadable product file attachments if digital products are required.
- Add persisted QR payloads or a backend QR verification endpoint.
- Add profile update pages for users and sellers.
- Add server-side pagination, sorting, and filtering for product catalogs.
- Add order item grouping so multi-product checkouts are represented as a single order aggregate.
- Add automated integration tests for authentication, cart, payment, upload, and seller APIs.
- Add production deployment documentation and CI workflows.

## Author

Built as a full-stack e-commerce portfolio project with React, Spring Boot, MySQL, Razorpay, and Cloudinary.
