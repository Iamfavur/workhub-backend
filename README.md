# WorkHub API

WorkHub API is a backend service for a freelance marketplace platform, built with Node.js, Express, and MongoDB. It supports user authentication, gig management, order processing, messaging, reviews, and wallet-based transactions.
This is basically a fiverr clone version by Favour Uduose.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Gigs](#gigs)
  - [Orders](#orders)
  - [Conversations & Messages](#conversations--messages)
  - [Reviews](#reviews)
- [Models](#models)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- **User Authentication** (JWT-based)
- **Role-based Access** (Seller/Buyer)
- **Gig Management** (CRUD)
- **Order Management** (Wallet-based, completion, refund)
- **Messaging System** (Conversations, messages)
- **Review System** (Buyers can review gigs)
- **Wallet System** (Balance, payments, refunds)
- **Stripe Integration** (for payment intents, optional)

---

## Tech Stack

- **Node.js** (v18+)
- **Express.js**
- **MongoDB** (via Mongoose)
- **JWT** for authentication
- **Stripe** for payments
- **dotenv** for environment variables
- **cookie-parser**, **cors**, **bcrypt**

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or cloud)
- Stripe account (for payment integration)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your values (see [Environment Variables](#environment-variables)).

4. **Start the server:**
   ```sh
   npm start
   ```
   The server runs on `http://localhost:8800`.

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```
MONGO=<your-mongodb-connection-string>
JWT_KEY=<your-jwt-secret>
STRIPE=<your-stripe-secret-key>
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description           |
|--------|--------------------|----------------------|
| POST   | `/api/auth/register` | Register a new user  |
| POST   | `/api/auth/login`    | Login user           |
| POST   | `/api/auth/logout`   | Logout user          |

### Users

| Method | Endpoint           | Description           |
|--------|--------------------|----------------------|
| GET    | `/api/users/:id`   | Get user by ID       |
| DELETE | `/api/users/:id`   | Delete user (self)   |

### Gigs

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | `/api/gigs/`            | Create a new gig (seller)  |
| GET    | `/api/gigs/`            | List gigs (with filters)   |
| GET    | `/api/gigs/single/:id`  | Get gig by ID              |
| DELETE | `/api/gigs/:id`         | Delete gig (owner only)    |

### Orders

| Method | Endpoint                        | Description                       |
|--------|---------------------------------|-----------------------------------|
| GET    | `/api/orders/`                  | List orders (buyer/seller)        |
| POST   | `/api/orders/create-new-order`   | Create new order (wallet-based)   |
| POST   | `/api/orders/complete-seller-order` | Mark seller order as complete  |
| POST   | `/api/orders/complete-buyer-order`  | Mark buyer order as complete   |
| POST   | `/api/orders/check-order-status`    | Check/refund order status      |

### Conversations & Messages

| Method | Endpoint                        | Description                       |
|--------|---------------------------------|-----------------------------------|
| GET    | `/api/conversations/`           | List conversations                |
| POST   | `/api/conversations/`           | Create conversation               |
| GET    | `/api/conversations/single/:id` | Get single conversation           |
| PUT    | `/api/conversations/:id`        | Update conversation (read status) |
| POST   | `/api/messages/`                | Send message                      |
| GET    | `/api/messages/:id`             | Get messages in conversation      |

### Reviews

| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/api/reviews/`      | Create review (buyers only)       |
| GET    | `/api/reviews/:gigId`| Get reviews for a gig             |
| DELETE | `/api/reviews/:id`   | Delete review (not implemented)   |

---

## Models

- **User**: username, email, password, isSeller, walletBalance, etc.
- **Gig**: userId, title, desc, price, category, images, etc.
- **Order**: gigId, buyerId, sellerId, price, status flags, delivery info.
- **Conversation**: sellerId, buyerId, read status, last message.
- **Message**: conversationId, userId, desc.
- **Review**: gigId, userId, star, desc.

See the `/models` directory for full schema definitions.

---

## Error Handling

Errors are handled centrally. Each error returns an HTTP status and a message.

Example:
```json
{
  "status": 403,
  "message": "You can delete only your account!"
}
```

---

## License

This project is licensed under the ISC License.

---

## Notes

- All protected routes require a valid JWT token in the `accessToken` cookie.
- Only buyers can create reviews.
- Only sellers can create gigs.
- Wallet-based order flow deducts from buyer's balance and credits seller on completion.
- Stripe payment flow is available in [`controllers/re-order.controller.js`](controllers/re-order.controller.js) but not enabled in main routes because it is for testing.

---