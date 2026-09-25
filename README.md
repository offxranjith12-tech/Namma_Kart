# NAMMA KART
## Complete Full-Stack Online Grocery Ordering System
### Customer + Admin + Integrated Delivery Fleet Partner

---

## 1. Project Overview

**Namma Kart** is a modern, full-stack, hackathon-ready online grocery ordering platform tailored for hyper-local neighborhood communities. It features an integrated 3-tier user ecosystem:

1. **Customer**: Browse fresh farm produce, dairy, bakery, and daily staples; manage carts, apply promo coupons, choose flexible delivery slots, track live order status, and review delivered items.
2. **Admin**: Oversee the product catalog, stock levels, category taxonomy, promo coupons, checkout time slots, order fulfillment lifecycle, and active delivery partner assignments.
3. **Delivery Partner**: View assigned grocery deliveries on a mobile-friendly dashboard, click-to-call customer contacts, view address details and item checklists, accept orders, transition status to `OUT_FOR_DELIVERY`, and mark orders as `DELIVERED`.

---

## 2. Complete Delivery Workflow

```
Customer places order
        ↓
Order Status: PLACED
        ↓
Admin reviews order & sets status: CONFIRMED / PREPARING
        ↓
Admin assigns active Delivery Partner
        ↓
Delivery Partner receives high-priority notification
        ↓
Delivery Partner opens Delivery Dashboard & accepts delivery
        ↓
Delivery Partner picks up groceries → marks OUT_FOR_DELIVERY
        ↓
Customer receives notification: "Order is now out for delivery"
        ↓
Delivery Partner arrives at doorstep → marks DELIVERED
        ↓
Order becomes DELIVERED (Payment marked PAID)
        ↓
Customer receives notification → Submits verified product review
```

---

## 3. Strict Design System

The application strictly enforces the **Namma Kart Visual Identity**:
- **Primary Color**: `oklch(0.47 0.13 151)` (Deep fresh green)
- **Background Surface**: `oklch(0.982 0.018 94)` (Warm off-white)
- **Soft Surface**: `oklch(0.95 0.025 94)` (Light warm tint)
- **Borders**: Transparent green tints (`oklch(0.47 0.13 151 / 0.14)`)
- **Typography**: **Nunito** exclusively across all headings, prices, body, and buttons.
- **Corner Radius**: Friendly rounded `0.75rem` base, with fully rounded pill buttons.
- **Mobile First**: Delivery Person UI is optimized for one-hand mobile navigation with a dedicated bottom app bar.

---

## 4. Tech Stack

- **Frontend**: React 18, Vite 5, React Router v6, Axios, Lucide React, Vanilla CSS design tokens
- **Backend**: Java 17, Spring Boot 3.2, Spring Data JPA, Spring Security, JWT (io.jsonwebtoken 0.11.5), BCrypt, Lombok
- **Database**: MySQL 8.0 / MySQL Compatible Cloud DB (with automatic JPA schema updates and comprehensive `DataInitializer` seed data)

---

## 5. Demo Credentials

Quick login buttons are available on the `/login` page for 1-click authentication:

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@grocery.com` | `Admin@123` | Full dashboard, catalog, inventory & delivery fleet manager |
| **Customer** | `customer@grocery.com` | `Customer@123` | Nandini Sharma (Bengaluru) |
| **Delivery Partner** | `delivery@grocery.com` | `Delivery@123` | Raghuveer Gowda (Hero Electric Scooter `KA-04-EV-1024`) |
| **Delivery Partner 2** | `suresh@delivery.com` | `Delivery@123` | Suresh Kumar (Honda Activa `KA-05-HL-4521`) |
| **Delivery Partner 3** | `ramesh@delivery.com` | `Delivery@123` | Ramesh Nayak (TVS iQube Electric `KA-01-EQ-8890`) |

---

## 6. Project Architecture

```
d:/Namma Kart/
├── backend/
│   ├── src/main/java/com/grocery/
│   │   ├── config/             # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── controller/         # Auth, Product, Cart, Order, Admin, Delivery APIs
│   │   ├── dto/                # Request & Response DTOs
│   │   ├── entity/             # JPA Entities (User, Product, Order, DeliveryPerson, etc.)
│   │   ├── exception/          # GlobalExceptionHandler & custom exceptions
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   ├── security/           # JwtTokenProvider, CustomUserDetailsService
│   │   ├── service/            # Business logic, pricing, stock validation, delivery logic
│   │   └── GroceryApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProductCard, OrderTimeline, AdminSidebar, DeliveryNav
│   │   ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│   │   ├── pages/
│   │   │   ├── admin/          # Dashboard, Orders, Products, DeliveryPersons, Slots, Coupons, Users
│   │   │   ├── delivery/       # DeliveryDashboard, DeliveryOrders, DeliveryDetails, History, Profile
│   │   │   ├── Home.jsx, Products.jsx, ProductDetails.jsx, Cart.jsx, Checkout.jsx, Orders.jsx...
│   │   ├── services/           # Centralized Axios API client (api.js)
│   │   ├── styles/             # index.css (Strict design tokens), App.css
│   │   ├── App.jsx             # Role-based route tree
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .env.example
└── README.md
```

---

## 7. Setup & Run Instructions

### Prerequisites
- Java 17+ and Maven 3.8+
- Node.js 18+ and npm
- MySQL Server (running on localhost:3306)

### 1. Backend Setup
```bash
cd backend

# Configure environment variables (optional, defaults provided in application.properties)
# export DB_URL="jdbc:mysql://localhost:3306/nammakart_db?createDatabaseIfNotExist=true"
# export DB_USERNAME="root"
# export DB_PASSWORD="your_password"

# Run Spring Boot backend
mvn spring-boot:run
```
The backend starts on `http://localhost:8080`.
The `DataInitializer` automatically provisions:
- 1 Admin
- 5 Customers
- 3 Delivery fleet partners
- 9 Categories
- 30+ High quality grocery products with images & stock
- 5 Promo coupons
- 4 Delivery slots
- Sample active and delivered orders

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 8. Key API Endpoints Summary

### Auth
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Unified authentication (returns JWT & role)
- `GET /api/users/me` - Profile

### Customer
- `GET /api/products` - Browse catalog
- `GET /api/products/{id}` - Details & customer ratings
- `GET /api/cart` / `POST /api/cart/items` / `PUT /api/cart/items/{id}` - Cart management
- `POST /api/coupons/validate` - Validate promo code
- `POST /api/orders` - Place order (backend price & stock calculation)
- `GET /api/orders/{id}` - Order tracking

### Admin
- `GET /api/admin/dashboard` - KPI metrics & revenue
- `GET /api/admin/orders` - Order management
- `PUT /api/admin/orders/{id}/status` - Status transition
- `PUT /api/admin/orders/{id}/assign-delivery` - Assign active Delivery Partner
- `GET /api/admin/delivery-persons` - Fleet list
- `POST /api/admin/delivery-persons` - Create delivery partner account

### Delivery Partner (Role Protected)
- `GET /api/delivery/dashboard` - Fleet KPI stats & assigned orders
- `GET /api/delivery/orders` - Active orders
- `GET /api/delivery/orders/{id}` - Order details with customer contact
- `PUT /api/delivery/orders/{id}/accept` - Acknowledge pickup
- `PUT /api/delivery/orders/{id}/status` - Mark `OUT_FOR_DELIVERY` or `DELIVERED`
- `GET /api/delivery/history` - Completed deliveries filter

---

## 9. Hackathon Demonstration Checklist

1. **Customer Workflow**:
   - Log in as `customer@grocery.com`
   - Browse catalog or search "Milk" / "Apples"
   - Add items to cart → Update quantities
   - Apply coupon `WELCOME50`
   - Proceed to checkout → Choose delivery slot & address → Select COD / UPI → Place Order
   - View dynamic order timeline at `/orders/:id`
2. **Admin Workflow**:
   - Log in as `admin@grocery.com`
   - Open `/admin/orders` → View the newly placed order
   - Confirm order → Set to Preparing
   - Select active delivery partner (e.g. `Raghuveer Gowda`) → Click Assign
3. **Delivery Partner Workflow**:
   - Log in as `delivery@grocery.com`
   - Dashboard instantly displays assigned order card
   - Open order details → View customer location and click-to-call phone
   - Mark `OUT_FOR_DELIVERY` → Order progresses
   - Mark `DELIVERED` → Trip completes
4. **Customer Post-Delivery Verification**:
   - Customer notification arrives
   - Customer opens order → Submits 5-star review and feedback
