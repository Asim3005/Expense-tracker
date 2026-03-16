import pytest


@pytest.mark.asyncio
async def test_list_transactions(client, sample_transaction):
    """Test listing all transactions."""
    response = await client.get("/api/v1/transactions")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_create_transaction(client, sample_category):
    """Test creating a new transaction."""
    transaction_data = {
        "amount": 25.50,
        "description": "API Test Transaction",
        "transaction_type": "expense",
        "category_id": sample_category.id,
    }
    response = await client.post("/api/v1/transactions", json=transaction_data)

    assert response.status_code == 201
    data = response.json()
    # Amount may be returned as string or number depending on serialization
    assert float(data["amount"]) == 25.50
    assert data["description"] == "API Test Transaction"
    assert data["transaction_type"] == "expense"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_transaction_validation(client):
    """Test transaction creation validation."""
    # Missing required field
    response = await client.post("/api/v1/transactions", json={})

    assert response.status_code == 422

    # Invalid amount (negative)
    response = await client.post("/api/v1/transactions", json={
        "amount": -10,
        "description": "Invalid",
        "transaction_type": "expense",
    })
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_transaction(client, sample_transaction):
    """Test getting a transaction by ID."""
    response = await client.get(f"/api/v1/transactions/{sample_transaction.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_transaction.id
    assert data["description"] == "Test transaction"


@pytest.mark.asyncio
async def test_get_nonexistent_transaction(client):
    """Test getting a non-existent transaction."""
    response = await client.get("/api/v1/transactions/nonexistent-id")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_transaction(client, sample_transaction):
    """Test updating a transaction."""
    update_data = {"amount": 200.00, "description": "Updated via API"}
    response = await client.put(
        f"/api/v1/transactions/{sample_transaction.id}",
        json=update_data
    )

    assert response.status_code == 200
    data = response.json()
    # Amount may be returned as string or number depending on serialization
    assert float(data["amount"]) == 200.00
    assert data["description"] == "Updated via API"


@pytest.mark.asyncio
async def test_update_nonexistent_transaction(client):
    """Test updating a non-existent transaction."""
    response = await client.put(
        "/api/v1/transactions/nonexistent-id",
        json={"amount": 100.00}
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_transaction(client, sample_transaction):
    """Test deleting a transaction."""
    response = await client.delete(f"/api/v1/transactions/{sample_transaction.id}")

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.asyncio
async def test_delete_nonexistent_transaction(client):
    """Test deleting a non-existent transaction."""
    response = await client.delete("/api/v1/transactions/nonexistent-id")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_health_check(client):
    """Test health check endpoint."""
    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test root endpoint."""
    response = await client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
