import pytest


@pytest.mark.asyncio
async def test_list_categories(client, sample_category):
    """Test listing all categories."""
    response = await client.get("/api/v1/categories")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["name"] == "Test Category"


@pytest.mark.asyncio
async def test_create_category(client):
    """Test creating a new category."""
    category_data = {
        "name": "API Test Category",
        "color": "#ff00ff",
        "icon": "api-test",
    }
    response = await client.post("/api/v1/categories", json=category_data)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "API Test Category"
    assert data["color"] == "#ff00ff"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_category_validation(client):
    """Test category creation validation."""
    # Missing required field
    response = await client.post("/api/v1/categories", json={})

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_category(client, sample_category):
    """Test getting a category by ID."""
    response = await client.get(f"/api/v1/categories/{sample_category.id}")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_category.id
    assert data["name"] == "Test Category"


@pytest.mark.asyncio
async def test_get_nonexistent_category(client):
    """Test getting a non-existent category."""
    response = await client.get("/api/v1/categories/nonexistent-id")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_category(client, sample_category):
    """Test updating a category."""
    update_data = {"name": "Updated via API"}
    response = await client.put(
        f"/api/v1/categories/{sample_category.id}",
        json=update_data
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated via API"
    assert data["color"] == sample_category.color  # Unchanged


@pytest.mark.asyncio
async def test_update_nonexistent_category(client):
    """Test updating a non-existent category."""
    response = await client.put(
        "/api/v1/categories/nonexistent-id",
        json={"name": "Updated"}
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_category(client, sample_category):
    """Test deleting a category."""
    response = await client.delete(f"/api/v1/categories/{sample_category.id}")

    assert response.status_code == 204
    assert response.content == b""


@pytest.mark.asyncio
async def test_delete_nonexistent_category(client):
    """Test deleting a non-existent category."""
    response = await client.delete("/api/v1/categories/nonexistent-id")

    assert response.status_code == 404
