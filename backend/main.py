from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import random # For simulating "Heat" levels

# Custom Imports
from services.etsy_service import search_etsy_listings
from core.math_engine import calculate_material_cost

# 1. Initialize the Brain
app = FastAPI(title="MarketLens API", version="0.1.0")

# 2. Allow the Frontend (React) to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS ---
class MaterialRequest(BaseModel):
    purchase_price: float
    purchase_amount: float
    purchase_unit: str
    recipe_amount: float
    recipe_unit: str

# --- ENDPOINTS ---

# 3. The Etsy Search (Project Specific)
@app.get("/api/search")
def search_market(query: str):
    print(f"🧠 Brain received request: Analyzing '{query}'...")
    
    real_data = search_etsy_listings(query)
    
    if real_data and "results" in real_data:
        first_item = real_data['results'][0]
        
        top_listings = []
        for item in real_data['results'][:5]:
            top_listings.append({
                "id": item.get('listing_id'),
                "title": item.get('title'),
                "price": item.get('price', {}).get('amount', 0) / 100,
                "url": item.get('url')
            })

        return {
            "status": "success",
            "source": "REAL_ETSY",
            "data": {
                "demand": "High" if first_item.get('num_favorers', 0) > 50 else "Medium", 
                "competition": f"{first_item.get('num_favorers', 0)} Likes",
                "profit_estimate": first_item.get('price', {}).get('amount', 0) / 100, 
                "listings": top_listings
            }
        }
    
    print("⚠️ Fallback to Mock Data (API likely pending)")
    time.sleep(1)
    return {
        "status": "success",
        "source": "MOCK_SIMULATION",
        "data": {
            "demand": "High (Simulated)", 
            "competition": "Medium",
            "profit_estimate": 24.50,
            "listings": []
        }
    }

# 4. The Cost Calculator
@app.post("/api/calculate-cost")
def get_material_cost(material: MaterialRequest):
    cost = calculate_material_cost(
        material.purchase_price,
        material.purchase_amount,
        material.purchase_unit,
        material.recipe_amount,
        material.recipe_unit
    )
    return {"cost": cost}

# 5. NEW: The Market Radar (Dashboard Data)
@app.get("/api/market-radar")
def get_market_radar():
    print("📡 Scanning Global Market Frequencies...")
    
    # In a real app, we would query Etsy for "trending" tags.
    # For now, we will perform a 'broad' search to get real items to show.
    # We search for "Gift" or "Handmade" to get a mix of popular items.
    
    radar_data = search_etsy_listings("handmade best sellers")
    
    trending_items = []
    if radar_data and "results" in radar_data:
        for item in radar_data['results'][:4]: # Grab 4 top items
            trending_items.append({
                "id": item.get('listing_id'),
                "title": item.get('title'),
                "price": item.get('price', {}).get('amount', 0) / 100,
                "likes": item.get('num_favorers', 0),
                "url": item.get('url')
            })

    # Simulate Category Heat (Randomized for the "Live" feel)
    categories = [
        {"name": "Jewelry", "heat": random.randint(70, 99), "trend": "↑"},
        {"name": "Home Decor", "heat": random.randint(40, 80), "trend": "→"},
        {"name": "Clothing", "heat": random.randint(60, 90), "trend": "↑"},
        {"name": "Digital Prints", "heat": random.randint(80, 100), "trend": "↑"},
        {"name": "Woodworking", "heat": random.randint(30, 60), "trend": "↓"}
    ]

    return {
        "status": "online",
        "timestamp": time.time(),
        "categories": categories,
        "trending_items": trending_items,
        "active_sector": "Handmade Goods"
    }

@app.get("/")
def read_root():
    return {"message": "MarketLens Brain is Online 🧠"}