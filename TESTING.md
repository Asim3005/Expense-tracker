# Integration Testing Guide

## Prerequisites

Before running integration tests, ensure:

1. **Backend is running:**
   ```bash
   cd backend
   uv run uvicorn app.main:app --reload
   ```

2. **Database is configured:**
   - Copy `backend/.env.local` to `backend/.env`
   - Update `DATABASE_URL` with your Neon PostgreSQL connection string
   - Run migrations: `uv run alembic upgrade head`
   - Seed categories: `uv run python seed_categories.py`

3. **Frontend is running:**
   ```bash
   cd frontend
   pnpm run dev
   ```

4. **API is accessible:**
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Frontend: http://localhost:3000

---

## API Integration Tests

### Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Transaction Endpoints

```bash
# Create a transaction
curl -X POST http://localhost:8000/api/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "description": "Grocery shopping",
    "transaction_type": "expense",
    "category_id": "category-id-here",
    "date": "2024-02-24"
  }'

# Get all transactions
curl http://localhost:8000/api/v1/transactions

# Get single transaction
curl http://localhost:8000/api/v1/transactions/{transaction_id}

# Update transaction
curl -X PUT http://localhost:8000/api/v1/transactions/{transaction_id} \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 55.00,
    "description": "Grocery shopping (updated)"
  }'

# Delete transaction
curl -X DELETE http://localhost:8000/api/v1/transactions/{transaction_id}
```

### Category Endpoints

```bash
# Get all categories
curl http://localhost:8000/api/v1/categories

# Create a category
curl -X POST http://localhost:8000/api/v1/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Education",
    "color": "#8b5cf6",
    "icon": "book"
  }'

# Update category
curl -X PUT http://localhost:8000/api/v1/categories/{category_id} \
  -H "Content-Type: application/json" \
  -d '{
    "color": "#a855f7"
  }'

# Delete category
curl -X DELETE http://localhost:8000/api/v1/categories/{category_id}
```

### Analytics Endpoints

```bash
# Get summary
curl http://localhost:8000/api/v1/analytics/summary

# Get spending by category
curl http://localhost:8000/api/v1/analytics/spending-by-category

# Get monthly trend
curl http://localhost:8000/api/v1/analytics/monthly-trend?months=12

# With date range
curl "http://localhost:8000/api/v1/analytics/summary?start_date=2024-01-01&end_date=2024-02-28"
```

---

## Manual Testing Checklist

### Dashboard Page (`/`)

- [ ] Page loads without errors
- [ ] Balance card displays correct total
- [ ] Income card displays correct total
- [ ] Expenses card displays correct total
- [ ] "Add Transaction" button opens form
- [ ] Recent transactions list displays
- [ ] Empty state shows when no transactions

### Transactions Page (`/transactions`)

- [ ] Page loads without errors
- [ ] All transactions are listed
- [ ] Transaction type filter works (income/expense)
- [ ] Category filter works
- [ ] Search by description works
- [ ] Date filters work
- [ ] Clear filters button works
- [ ] Add transaction form works
- [ ] Delete transaction shows confirmation
- [ ] Delete transaction removes item
- [ ] Empty state shows when filtered
- [ ] Pagination works

### Analytics Page (`/analytics`)

- [ ] Page loads without errors
- [ ] Income/expenses/net cards display
- [ ] Spending by category pie chart renders
- [ ] Category breakdown list shows
- [ ] Progress bars show correct percentages
- [ ] Monthly trend chart renders
- [ ] Date range filter works
- [ ] Empty states show when no data

### Transaction CRUD Flow

- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Transaction appears on dashboard
- [ ] Transaction appears on transactions page
- [ ] Transaction with category shows category badge
- [ ] Edit transaction (if implemented)
- [ ] Delete transaction with confirmation
- [ ] Transaction removed from all views
- [ ] Balance updates after deletion

### Category Management

- [ ] Create new category
- [ ] Category appears in dropdown
- [ ] Update category name/color
- [ ] Create transaction with new category
- [ ] Transaction shows correct category
- [ ] Analytics shows spending by new category
- [ ] Delete category

### Navigation

- [ ] Dashboard link works
- [ ] Transactions link works
- [ ] Analytics link works
- [ ] Back button in browser works
- [ ] Active page shows in nav

### Error Handling

- [ ] Network errors show user-friendly message
- [ ] API errors show user-friendly message
- [ ] Loading states show during fetch
- [ ] Retry buttons work on errors

### Responsive Design

- [ ] Mobile view (375px)
- [ ] Tablet view (768px)
- [ ] Desktop view (1024px+)
- [ ] Charts are responsive
- [ ] Tables/lists are scrollable on mobile
- [ ] Forms are usable on mobile

### Dark Mode

- [ ] Dark mode colors are readable
- [ ] Charts work in dark mode
- [ ] Borders and shadows are visible
- [ ] Text contrast is sufficient

---

## User Flow Testing

### Flow 1: Quick Transaction Entry

1. Navigate to Dashboard
2. Click "+ Add Transaction"
3. Fill in: Amount: $50, Type: Expense, Description: "Lunch"
4. Submit form
5. Verify transaction appears in recent list
6. Verify balance decreased by $50

### Flow 2: Browse Transactions

1. Navigate to Transactions page
2. Verify all transactions listed
3. Filter by "Expense"
4. Verify only expenses shown
5. Search for a description
6. Clear filters
7. Click delete on a transaction
8. Confirm deletion
9. Verify transaction removed

### Flow 3: Analytics

1. Navigate to Analytics page
2. View spending by category chart
3. Click on a slice (if interactive)
4. View category breakdown list
5. Set date range filter
6. Verify charts update
7. View monthly trend chart

### Flow 4: Category Creation

1. Navigate to any page with category dropdown
2. Note existing categories
3. Create a new category via API
4. Refresh page
5. Verify new category appears in dropdown
6. Add transaction with new category
7. Navigate to Analytics
8. Verify spending shown for new category

---

## Common Issues & Troubleshooting

### CORS Errors

**Symptom:** Browser shows CORS policy errors in console

**Solution:** Ensure backend CORS allows http://localhost:3000
```python
# In backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    ...
)
```

### Database Connection Errors

**Symptom:** Backend fails to start or API returns 500 errors

**Solution:**
1. Verify DATABASE_URL in backend/.env is correct
2. Test connection with: `psql $DATABASE_URL`
3. Ensure SSL is enabled for Neon: `?ssl=require`

### Migration Issues

**Symptom:** Tables don't exist or schema mismatch

**Solution:**
```bash
cd backend
uv run alembic upgrade head
```

### Empty Data

**Symptom:** No transactions or categories showing

**Solution:**
```bash
cd backend
uv run python seed_categories.py
# Then add some test transactions via API or UI
```

---

## Performance Checks

- [ ] Dashboard loads under 1 second
- [ ] Transactions page loads under 1 second
- [ ] Analytics page loads under 2 seconds
- [ ] Filters apply instantly
- [ ] Form submissions complete under 500ms
- [ ] Charts render smoothly
- [ ] No memory leaks on page refresh
