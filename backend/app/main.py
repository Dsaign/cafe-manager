import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.recipes import recipe_router

load_dotenv()
app = FastAPI()

HOST_ORIGIN = [origin for origin in [os.getenv("HOST_ORIGIN")] if origin is not None]

app.add_middleware(
    CORSMiddleware,
    allow_origins= HOST_ORIGIN, # porta padrão do Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============
# ROUTES
# ============
app.include_router(recipe_router)

# ============
# INGREDIENTS
# ============

@app.get("/get/ingredients")
def get_ingredients():
    return {"message": "got all ingredients"}

@app.get("/get/ingredients/{id}")
def get_ingredient_from_id(id: int):
    return {"message": f"ingredient {id}"}

@app.post("/post/ingredients")
def post_ingredients():
    return {"message": "post ingredient"}

@app.put("/update/ingredients/{id}")
def update_ingredients(id: int):
    return {"message": f"ingredient {id} updated"}

@app.delete("/delete/ingredients/{id}")
def delete_ingredients(id: int):
    return {"message": f"{id} ingredient deleted"}


# ============
# SUPPLIERS
# ============

@app.get("/get/suppliers")
def get_suppliers():
    return {"message": "got all suppliers"}

@app.get("/get/suppliers/{id}")
def get_supplier_from_id(id: int):
    return {"message": f"supplier {id}"}

@app.post("/post/suppliers")
def post_suppliers():
    return {"message": "post supplier"}

@app.put("/update/suppliers/{id}")
def update_suppliers(id: int):
    return {"message": f"supplier {id} updated"}

@app.delete("/delete/suppliers/{id}")
def delete_suppliers(id: int):
    return {"message": f"{id} supplier deleted"}


# ============
# PURCHASES
# ============

@app.get("/get/purchases")
def get_purchases():
    return {"message": "got all purchases"}

@app.get("/get/purchases/{id}")
def get_purchase_from_id(id: int):
    return {"message": f"purchase {id}"}

@app.post("/post/purchases")
def post_purchases():
    return {"message": "post purchase"}

@app.put("/update/purchases/{id}")
def update_purchases(id: int):
    return {"message": f"purchase {id} updated"}

@app.delete("/delete/purchases/{id}")
def delete_purchases(id: int):
    return {"message": f"{id} purchase deleted"}


# ============
# USERS
# ============

@app.get("/get/users")
def get_users():
    return {"message": "got all users"}

@app.get("/get/users/{id}")
def get_user_from_id(id: int):
    return {"message": f"user {id}"}

@app.post("/post/users")
def post_users():
    return {"message": "post user"}

@app.put("/update/users/{id}")
def update_users(id: int):
    return {"message": f"user {id} updated"}

@app.delete("/delete/users/{id}")
def delete_users(id: int):
    return {"message": f"{id} user deleted"}

