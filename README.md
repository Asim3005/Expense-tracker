# Personal Finance Tracker

A full-stack web application for tracking income, expenses, and financial analytics.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Recharts
- **Backend:** FastAPI, Python 3.11+, SQLAlchemy (Async)
- **Database:** PostgreSQL (Neon)
- **Development Tools:** uv, pnpm

## Prerequisites

- Python 3.11+
- Node.js 18+
- uv package manager
- pnpm (or npm/yarn)

## Quick Start

### 1. Set Up Database

1. Create a free account at [Neon](https://neon.tech)
2. Create a new PostgreSQL project
3. Copy the connection string (format: `postgresql+asyncpg://user:password@ep-xxx.region.aws.neon.tech/neondb?ssl=require`)

### 2. Backend Setup

```bash
cd backend

# Copy and configure environment
cp .env.local .env

# Edit .env and replace DATABASE_URL with your Neon connection string

# Create virtual environment and install dependencies (uv init already did this)
# Install any additional deps if needed
uv sync

# Run database migrations
uv run alembic upgrade head

# Seed default categories
uv run python seed_categories.py

# Start the backend server
uv run uvicorn app.main:app --reload
```

Backend will run at http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

Frontend will run at http://localhost:3000

## Project Structure

```
Finance_Tracker/
├── backend/                 # FastAPI Application
│   ├── app/
│   │   ├── main.py         # FastAPI app entry
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── api/v1/        # API routes
│   │   └── services/       # Business logic
│   ├── alembic/           # Database migrations
│   └── seed_categories.py  # Seed script
│
├── frontend/                # Next.js Application
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Dashboard
│   │   ├── transactions/   # Transactions page
│   │   └── analytics/      # Analytics page
│   ├── components/         # React components
│   └── lib/
│       ├── types.ts        # TypeScript types
│       └── api.ts          # API client
│
├── SPEC.md                # Detailed specification
└── TESTING.md             # Integration testing guide
```

## Features

- **Dashboard**: View account balance, total income/expenses, and recent transactions
- **Transactions**: Add, view, filter, and delete transactions
- **Categories**: Manage transaction categories
- **Analytics**: Visual spending breakdown by category and monthly trends
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode**: Full dark mode support

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/transactions` | List transactions |
| POST | `/api/v1/transactions` | Create transaction |
| GET | `/api/v1/transactions/{id}` | Get transaction |
| PUT | `/api/v1/transactions/{id}` | Update transaction |
| DELETE | `/api/v1/transactions/{id}` | Delete transaction |
| GET | `/api/v1/categories` | List categories |
| POST | `/api/v1/categories` | Create category |
| GET | `/api/v1/categories/{id}` | Get category |
| PUT | `/api/v1/categories/{id}` | Update category |
| DELETE | `/api/v1/categories/{id}` | Delete category |
| GET | `/api/v1/analytics/summary` | Get financial summary |
| GET | `/api/v1/analytics/spending-by-category` | Get spending by category |
| GET | `/api/v1/analytics/monthly-trend` | Get monthly trends |

## Testing

See [TESTING.md](./TESTING.md) for comprehensive integration testing instructions.

### Run Backend Tests

```bash
cd backend
uv run pytest
```

### Run Frontend Tests

```bash
cd frontend
pnpm test
```

## Development

### Backend

```bash
cd backend
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
pnpm run dev
```

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.region.aws.neon.tech/neondb?ssl=require
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License

MIT
