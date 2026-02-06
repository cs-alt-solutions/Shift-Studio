import os
import requests
from dotenv import load_dotenv

# Load the secrets from the .env file
load_dotenv()

API_KEY = os.getenv("ETSY_KEYSTRING")

def search_etsy_listings(keyword):
    """
    Searches Etsy for active listings matching the keyword.
    """
    if not API_KEY:
        print("❌ Error: No API Key found in .env file")
        return None

    # Etsy V3 API Endpoint for listing active listings
    url = f"https://openapi.etsy.com/v3/application/listings/active"
    
    # Parameters for the search
    params = {
        "client_id": API_KEY,
        "keywords": keyword,
        "limit": 10,  # Grab top 10 for now
        "sort_on": "score", # Sort by relevance
        "includes": "Images" # We need pictures!
    }

    try:
        print(f"📡 Calling Etsy API for: {keyword}...")
        response = requests.get(url, params=params)
        
        # Check if Etsy said "Yes" (200 OK)
        if response.status_code == 200:
            print("✅ Etsy responded with data!")
            return response.json()
        elif response.status_code == 403:
            print(f"⚠️ Access Denied (403). Your App might still be 'Pending'.")
            return {"error": "Pending Approval"}
        else:
            print(f"❌ API Error: {response.status_code} - {response.text}")
            return {"error": f"API Error {response.status_code}"}

    except Exception as e:
        print(f"💥 Connection Failed: {e}")
        return {"error": str(e)}