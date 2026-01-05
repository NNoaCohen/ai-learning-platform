# AI Learning Platform - Frontend

React application with TypeScript for AI-driven learning platform.

## Tech Stack

- **React + TypeScript** - Modern UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **js-cookie** - Cookie management

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Route components
├── services/       # API integration
├── context/        # State management
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Environment Variables**
```bash
cp .env.example .env
# Edit .env with backend URL
```

3. **Start Development Server**
```bash
npm start
```

Application runs on `http://localhost:3002`

## Environment Variables

```
REACT_APP_API_URL=http://localhost:3000
PORT=3002
```

## Key Components

### Pages
- **Login/Register** - User authentication
- **Dashboard** - Main learning interface
- **CategorySelection** - Browse learning topics
- **LessonView** - Display AI-generated lessons
- **History** - View past learning sessions
- **AdminDashboard** - User and prompt management

### Services
- **authService** - Authentication API calls
- **categoryService** - Category/subcategory data
- **promptService** - AI lesson requests
- **userService** - User management

### Context
- **AuthContext** - User authentication state
- **CategoryContext** - Learning categories state

## Features

- JWT-based authentication
- Category and subcategory selection
- AI lesson generation
- Learning history tracking
- Admin dashboard
- Responsive design

## Scripts

- `npm start` - Development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend communicates with the backend API at `REACT_APP_API_URL`. All API calls include JWT tokens for authentication.