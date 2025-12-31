# AI-Driven Learning Platform

This project is an AI-driven learning platform that allows users to select learning topics by category and subcategory, submit prompts to an AI model, receive generated lessons, and track their learning history. The platform is designed for learners who want personalized, AI-generated educational content with organized learning paths.

## Features

- **User Authentication** - JWT-based registration and login system
- **Category & Subcategory Learning** - Organized learning topics for structured education
- **AI-Generated Lessons** - OpenAI integration for personalized lesson content
- **Personal Learning History** - Track and revisit previous learning sessions
- **Admin Dashboard** - Manage users and monitor prompt history
- **REST API Backend** - Structured API endpoints for all operations
- **Modular Full-Stack Architecture** - Clean separation of concerns

## Tech Stack

### Backend
- **Node.js + Express** (TypeScript)
- **MongoDB + Mongoose** - Document database with ODM
- **OpenAI API** - AI lesson generation
- **JWT Authentication** - Secure user sessions
- **bcrypt** - Password hashing

### Frontend
- **React + TypeScript** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **js-cookie** - Cookie management

### Infrastructure
- **Docker Compose** - MongoDB containerization
- **Environment Variables** - Configuration management

## Project Structure

```
ai-learning-platform/
├── ai-drive-backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database and app configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Authentication & validation
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── seed/            # Database seeding
│   ├── docker-compose.yml   # MongoDB container
│   └── package.json
├── ai-drive-frontend/         # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API integration
│   │   ├── context/        # State management
│   │   └── types/          # TypeScript definitions
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- **Node.js** (v16+)
- **Docker** (for MongoDB)
- **OpenAI API Key** (optional - can be mocked)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/USERNAME/ai-learning-platform.git
cd ai-learning-platform
```

2. **Start MongoDB (using Docker)**
```bash
cd ai-drive-backend
docker-compose up -d
```

3. **Backend Setup**
```bash
cd ai-drive-backend
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

4. **Seed Database** (Optional)
```bash
# Seed categories and subcategories
npx ts-node src/seed/seedCategories.ts

# Create admin user
npx ts-node src/seed/seedAdmin.ts
```

5. **Frontend Setup**
```bash
cd ai-drive-frontend
npm install
npm start
```
Frontend runs on `http://localhost:3002`

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai_drive
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_openai_key_here
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000
PORT=3002
```

> **Note:** See `.env` files in backend and frontend directories for reference.

## Admin Access

To access the admin dashboard, use the following credentials:

- **Phone:** `0501234567`
- **Password:** `admin123`
- **Role:** `admin`

> **Note:** Run the admin seed script (`npx ts-node src/seed/seedAdmin.ts`) to create the admin user.

## Example Use Case

1. **User Registration** - New user creates an account
2. **Category Selection** - User browses available learning categories (e.g., Science, Technology)
3. **Subcategory Selection** - User selects specific topic (e.g., Space, Physics)
4. **Prompt Submission** - User enters: "Teach me about black holes"
5. **AI Lesson Generation** - System sends prompt to OpenAI and receives structured lesson
6. **Learning History** - User can revisit previous lessons in their dashboard

## Database Schema

### Users
- `id`, `name`, `email`, `password`, `phone`, `role`, `createdAt`

### Categories
- `id`, `name`

### Subcategories
- `id`, `name`, `categoryId`

### Prompts
- `id`, `userId`, `categoryId`, `subcategoryId`, `prompt`, `response`, `createdAt`

## API Endpoints

### Authentication

#### Register User
- **POST** `/users/register`
- **Body:**
```json
{
  "name": "John Doe",
  "phone": "0501234567",
  "password": "password123",
  "role": "user"
}
```
- **Response:**
```json
{
  "_id": "64a1b2c3d4e5f6789",
  "name": "John Doe",
  "phone": "0501234567",
  "role": "user"
}
```

#### Login User
- **POST** `/users/login`
- **Body:**
```json
{
  "phone": "0501234567",
  "password": "password123"
}
```
- **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789",
    "name": "John Doe",
    "phone": "0501234567",
    "role": "user"
  }
}
```

### Categories

#### Get All Categories
- **GET** `/categories`
- **Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789",
    "name": "Science"
  },
  {
    "_id": "64a1b2c3d4e5f6790",
    "name": "Math"
  }
]
```

#### Get Subcategories by Category
- **GET** `/categories/:id`
- **Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6791",
    "name": "Space",
    "categoryId": "64a1b2c3d4e5f6789"
  },
  {
    "_id": "64a1b2c3d4e5f6792",
    "name": "Physics",
    "categoryId": "64a1b2c3d4e5f6789"
  }
]
```

### Prompts

#### Submit Learning Prompt
- **POST** `/prompts/add`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "userId": "64a1b2c3d4e5f6789",
  "categoryId": "64a1b2c3d4e5f6789",
  "subcategoryId": "64a1b2c3d4e5f6791",
  "promptText": "Teach me about black holes"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6793",
    "userId": "64a1b2c3d4e5f6789",
    "categoryId": "64a1b2c3d4e5f6789",
    "subcategoryId": "64a1b2c3d4e5f6791",
    "prompt": "Teach me about black holes",
    "response": "Black holes are regions of spacetime...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Prompt created and AI response saved"
}
```

#### Delete Prompt
- **DELETE** `/prompts/:promptId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6793",
    "deleted": true
  },
  "message": "Prompt deleted successfully"
}
```

### User Management

#### Get User History
- **GET** `/users/:id/history`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6793",
    "prompt": "Teach me about black holes",
    "response": "Black holes are regions of spacetime...",
    "category": "Science",
    "subcategory": "Space",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get All Users (Admin Only)
- **GET** `/users`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789",
    "name": "John Doe",
    "phone": "0501234567",
    "role": "user",
    "createdAt": "2024-01-15T09:00:00Z"
  }
]
```

## Assumptions & Notes

- **OpenAI API** can be mocked if API key is not provided
- **Admin users** are defined via role-based access in the database
- **MongoDB** is used for flexible document storage suitable for learning content
- This project was built as a **take-home assignment** demonstrating full-stack development skills

## Future Improvements

- **Pagination and Search** - Handle large datasets efficiently
- **Caching** - Cache AI responses to reduce API costs
- **Advanced Analytics** - Learning progress tracking and insights
- **Content Rating** - User feedback on AI-generated lessons
- **Production Deployment** - CI/CD pipeline and cloud hosting

---

**Developed by Noa Cohen**  
Full-Stack Developer 