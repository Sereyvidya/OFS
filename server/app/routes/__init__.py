# Import route modules
from . import auth_routes, user_routes, product_routes, cart_item_routes, order_routes

# Get the blueprints from the imported routes
auth_bp = auth_routes.auth_bp
user_bp = user_routes.user_bp
product_bp = product_routes.product_bp
cart_item_bp = cart_item_routes.cart_item_bp
order_bp = order_routes.order_bp