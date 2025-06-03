# Import route modules
from . import auth_routes, product_routes, cart_item_routes

# Register the imported blueprints
auth_bp = auth_routes.auth_bp
product_bp = product_routes.product_bp
cart_item_bp = cart_item_routes.cart_item_bp