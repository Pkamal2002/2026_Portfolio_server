# Portfolio Backend (Server)

This is the Node.js/Express backend API that powers the dynamic sections of the personal portfolio (Projects and Contact forms). 

## 🚀 Technologies Used
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose ORM)
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs
* **Utilities**: CORS, dotenv

## 📦 Setup & Installation
1. Ensure Node.js and MongoDB are installed (or have a MongoDB Atlas account).
2. Navigate to the `server` directory: `cd server`
3. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Environment Configuration
Create a `.env` file in the root of the `server` folder:
```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_replace_me
```

## 💻 Starting the Server
* **Development Mode** (auto-restarts on save via `nodemon`):
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm start
  ```

## 🔌 API Endpoints
All endpoints are relative to the base `/api` path.

### Public Routes
* `GET /api/projects` - Fetches all portfolio projects sorted by newest first.
* `POST /api/contact` - Submits a contact form message.
* `POST /api/auth/login` - Authenticates an admin user and returns a standard JWT token.
* `POST /api/auth/register` - Registers a new user.

### Protected Routes (Requires JWT in 'Authorization' Header)
* `POST /api/projects` - Adds a new project.
* `GET /api/contact` - Retrieves all submitted contact messages.

## 🔒 Security
The API utilizes an `authMiddleware` that checks the standard `Authorization: Bearer <token>` header for verification on protected routes.
