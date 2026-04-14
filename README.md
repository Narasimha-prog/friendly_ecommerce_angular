# Friendly E-Commerce (Angular Frontend)

A modular, enterprise-ready E-commerce storefront built with Angular. This project features a clean separation between administrative controls and the customer shopping experience, powered by an automated API layer.

---

## 🏗 Architecture Overview

The project is structured to handle multiple microservices (Auth, Cart, Inventory, Order, Payment, Product, User) through generated API clients.

### 📁 Directory Breakdown
* **`src/app/admin`**: Management dashboard for products, categories, inventory, and global orders.
* **`src/app/shop`**: Customer-facing features including the catalog, cart, and product filters.
* **`src/app/api`**: Auto-generated services based on the OpenAPI specifications found in `src/openapi`.
* **`src/app/auth`**: Security layer featuring JWT Interceptors and Role-Based Guards.
* **`src/app/shared`**: Reusable UI components (Toasts), shared models, and font-awesome configurations.

---

## 🛠 Tech Stack

| Feature | Technology |
| :--- | :--- |
| **Framework** | Angular (Latest) |
| **Styling** | SCSS / CSS |
| **Icons** | Font Awesome |
| **API Integration** | OpenAPI / Swagger Aggregator |
| **Security** | JWT / AuthGuards |
| **Interceptors** | Ngrok & Auth Interceptors |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (LTS version)
* Angular CLI (`npm install -g @angular/cli`)

### Installation
1. Clone the repository:
   ```
   git clone <your-repo-url>

2. Install dependencies:
   ```

   npm install
   ````

3. Run Development Server:
   ```

    ng serve
   ```
Navigate to http://localhost:4200/.


### 📡 API Generation & OpenAPI
This project uses OpenAPI Generator to maintain sync with the backend microservices. The JSON schemas are located in src/openapi/.

To update the services:

Replace the .json files in src/openapi/ with the latest Swagger specs.

Run the generation script:

### Example command (adjust based on your package.json scripts)
```
npm run generate:api
```
---
### 🔒 Features & Modules
Admin Dashboard
---
Category Management: Organize products into groups.

Inventory Tracking: Real-time stock updates and monitoring.

Product CRUD: Interface to add, update, and remove products.

Order Oversight: View and manage all customer transactions.

Shopping Experience
---
Product Catalog: Paginated and filterable product lists.

Smart Search: Filter products by category and attributes.

Cart System: Persistent shopping cart with local storage backup.

User Profile: Track personal order history and status.

## Security
JWT Interceptors: Automatically attaches Authorization headers.

Ngrok Interceptor: Handles specialized headers for development tunnels.

Auth Guards: Protects sensitive routes from unauthorized access.

## 🧪 Testing
Run unit tests using Karma:

ng test


## 👥 Author
Lakshmi Narasimha Reddy Pittu

GitHub: https://github.com/Narasimha-prog/friendly_ecommerce_angular.git

Project: Friendly E-commerce Angular

## 📄 License
This project is licensed under the MIT License.
