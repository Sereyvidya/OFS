# Import route modules
from . import auth_routes, user_routes, product_routes, cartItem_routes, order_routes

# The blueprints are already imported from the route modules above, so registering them below
auth_bp = auth_routes.auth_bp
user_bp = user_routes.user_bp
product_bp = product_routes.product_bp
cartItem_bp = cartItem_routes.cartItem_bp
order_bp = order_routes.order_bp