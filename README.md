# Overview

**Bookstore Backend API** is a scalable, RESTful backend system built for an online bookstore platform. Designed using the **Modular Monolith** architecture with a clean **Controller-Service** separation, this repository ensures clear domain boundaries, high maintainability, and seamless integration between core e-commerce workflows—from browsing catalogs and managing shopping carts to order processing.

## Features

The system is organized into four core domain modules, communicating strictly through well-defined public interfaces:

* **Auth Module (`auth`)**
  * User registration and login using stateless **JWT (JSON Web Token)** authentication.
  * Password hashing and credential verification (`bcrypt`).
  * Role-based access control (RBAC) middleware separating Customer and Seller/Admin permissions.

* **User Module (`users`)**
  * Customer profile management (personal details, contact info, shipping addresses).

* **Catalog Module (`catalog`)**
  * Hierarchical book categorization and top-selling book rankings per category.
  * Detailed book information retrieval, including multi-image galleries, average customer ratings, and similar book recommendations.
  * Optimized batch querying (`getBooksByIds`) to support high-performance cart and order price calculations.

* **Orders Module (`orders`)**
  * **Shopping Cart Management:** Add items, auto-increment quantities, remove products, and calculate real-time cart subtotals.
  * **Order Processing:** Checkout workflows, order lifecycle tracking, and order cancellation (`cancelOrder`).

## Tech Stack

* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **Database & ORM:** Relational Database (SQL Server) with **Sequelize ORM** (supporting both model queries and optimized raw SQL window functions)
* **Authentication & Security:** `jsonwebtoken` (JWT), `bcrypt`
* **Architecture Pattern:** Modular Monolith (Feature-driven structure with Controller-Service layers)

## Project structure
```text
online-bookstore-backend/
  ├── README.md
  ├── package.json
  └── src/
      ├── api/
      │   └── customer-app/
      │       ├── routes.js
      │       └── server.js
      ├── modules/
      │   ├── auth/
      │   │   ├── controllers/
      │   │   │   └── AuthController.js
      │   │   └── services/
      │   │       └── AuthService.js
      │   ├── catalog/
      │   │   ├── index.js
      │   │   ├── controllers/
      │   │   │   └── BookController.js
      │   │   ├── models/
      │   │   │   ├── BookImageModel.js
      │   │   │   ├── BookModel.js
      │   │   │   └── CategoryModel.js
      │   │   └── services/
      │   │       └── BookService.js
      │   ├── orders/
      │   │   ├── controllers/
      │   │   │   ├── CartController.js
      │   │   │   └── OrderController.js
      │   │   ├── model/
      │   │   │   ├── CartModel.js
      │   │   │   ├── OrderDeatilModel.js
      │   │   │   └── OrderModel.js
      │   │   └── services/
      │   │       ├── CartService.js
      │   │       └── OrderService.js
      │   └── user/
      │       ├── index.js
      │       ├── controllers/
      │       │   └── UserController.js
      │       ├── model/
      │       │   └── UserModel.js
      │       └── services/
      │           └── UserService.js
      └── shared/
          ├── database/
          │   └── connection.js
          └── middlewares/
              └── jwtAuth.js
```