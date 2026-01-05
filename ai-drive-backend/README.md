# AI Learning Platform - Backend

Node.js + Express API server with TypeScript, MongoDB, and OpenAI integration.

## Tech Stack

- **Node.js + Express** (TypeScript)
- **MongoDB + Mongoose** - Document database
- **OpenAI API** - AI lesson generation
- **JWT Authentication** - Secure user sessions
- **bcrypt** - Password hashing

## Project Structure

```
src/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── middlewares/      # Auth & validation
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── services/        # Business logic
└── seed/            # Database seeding
```

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Start MongoDB**
```bash
docker-compose up -d
```

3. **Environment Variables**
```bash
cp .env.example .env
# Edit .env with your values
```

4. **Seed Database**
```bash
npx ts-node src/seed/seedCategories.ts
npx ts-node src/seed/seedAdmin.ts
```

5. **Run Development Server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Environment Variables

Copy the example file and fill in your values:
```bash
cp .env.example .env
```

Required variables:
- `JWT_SECRET` - Generate a secure random string
- `OPENAI_API_KEY` - Your OpenAI API key (optional - will use mock responses if not provided)
- `MONGO_URI` - MongoDB connection string (default works with Docker setup)

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ai_drive
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
OPENAI_API_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_openai_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/subcategories` - Get subcategories

### Prompts
- `POST /api/prompts` - Submit learning prompt
- `GET /api/prompts/history` - Get user's learning history

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/prompts` - Get all prompts

## Database Models

### User
```typescript
{
  name: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  promptHistory: ObjectId[];
}
```

### Category
```typescript
{
  name: string;
}
```

### Subcategory
```typescript
{
  name: string;
  categoryId: ObjectId;
}
```

### Prompt
```typescript
{
  userId: ObjectId;
  categoryId: ObjectId;
  subcategoryId: ObjectId;
  prompt: string;
  response: string;
}
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm start` - Production server