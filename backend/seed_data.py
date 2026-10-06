import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitepos_backend.settings')
django.setup()

from pos_api.models import Category, Product, Customer, Order

CATEGORIES = [
    { 'id': 'cat-1', 'name': 'Tea', 'slug': 'tea', 'icon': 'CupSoda', 'active': True, 'color': '#f59e0b' },
    { 'id': 'cat-2', 'name': 'Coffee', 'slug': 'coffee', 'icon': 'Coffee', 'active': True, 'color': '#b45309' },
    { 'id': 'cat-3', 'name': 'Drinks', 'slug': 'drinks', 'icon': 'GlassWater', 'active': True, 'color': '#06b6d4' },
    { 'id': 'cat-4', 'name': 'Burgers', 'slug': 'burgers', 'icon': 'UtensilsCrossed', 'active': True, 'color': '#f97316' },
    { 'id': 'cat-5', 'name': 'Pizza', 'slug': 'pizza', 'icon': 'Pizza', 'active': True, 'color': '#ef4444' },
    { 'id': 'cat-6', 'name': 'Sandwich', 'slug': 'sandwich', 'icon': 'Sandwich', 'active': True, 'color': '#84cc16' },
    { 'id': 'cat-7', 'name': 'Fries', 'slug': 'fries', 'icon': 'Flame', 'active': True, 'color': '#eab308' },
    { 'id': 'cat-8', 'name': 'Snacks', 'slug': 'snacks', 'icon': 'Cookie', 'active': True, 'color': '#a855f7' },
    { 'id': 'cat-9', 'name': 'Combos', 'slug': 'combos', 'icon': 'Gift', 'active': True, 'color': '#ec4899' },
    { 'id': 'cat-10', 'name': 'Desserts', 'slug': 'desserts', 'icon': 'IceCream', 'active': True, 'color': '#6366f1' },
]

PRODUCTS = [
    {
        'id': 'prod-1',
        'name': 'Masala Cutting Tea',
        'category': 'tea',
        'description': 'Aromatic spiced ginger & cardamom hot milk tea',
        'price': 15,
        'cost_price': 5,
        'gst': 5,
        'stock': 120,
        'min_stock': 25,
        'image': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-2',
        'name': 'Filter Coffee',
        'category': 'coffee',
        'description': 'Authentic South Indian chicory-blend frothy hot coffee',
        'price': 25,
        'cost_price': 8,
        'gst': 5,
        'stock': 90,
        'min_stock': 20,
        'image': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-3',
        'name': 'Rich Cold Coffee',
        'category': 'coffee',
        'description': 'Chilled creamy blended coffee topped with chocolate syrup',
        'price': 80,
        'cost_price': 28,
        'gst': 5,
        'stock': 45,
        'min_stock': 15,
        'image': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-4',
        'name': 'Fresh Mint Lime Juice',
        'category': 'drinks',
        'description': 'Refreshing squeezed lemon cooler with crushed garden mint',
        'price': 50,
        'cost_price': 15,
        'gst': 5,
        'stock': 65,
        'min_stock': 20,
        'image': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-5',
        'name': 'Chilled Mojito Cooler',
        'category': 'drinks',
        'description': 'Sparkling soda refresher with lime, mint and cane syrup',
        'price': 90,
        'cost_price': 25,
        'gst': 5,
        'stock': 35,
        'min_stock': 10,
        'image': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-6',
        'name': 'Crispy Veg Burger',
        'category': 'burgers',
        'description': 'Golden spiced potato-herb patty with crunchy lettuce & mayo',
        'price': 90,
        'cost_price': 32,
        'gst': 5,
        'stock': 40,
        'min_stock': 15,
        'image': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-7',
        'name': 'Crispy Chicken Burger',
        'category': 'burgers',
        'description': 'Tender fried chicken breast with garlic aioli & pickled onions',
        'price': 130,
        'cost_price': 55,
        'gst': 5,
        'stock': 35,
        'min_stock': 10,
        'image': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-8',
        'name': 'Classic Cheese Margherita',
        'category': 'pizza',
        'description': 'Thin crust loaded with real mozzarella and fresh basil oil',
        'price': 160,
        'cost_price': 60,
        'gst': 5,
        'stock': 25,
        'min_stock': 8,
        'image': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-9',
        'name': 'Paneer Tikka Supreme',
        'category': 'pizza',
        'description': 'Spiced tandoori cottage cheese cubes with bell peppers & onion',
        'price': 210,
        'cost_price': 80,
        'gst': 5,
        'stock': 20,
        'min_stock': 5,
        'image': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-10',
        'name': 'Veg Grilled Club Sandwich',
        'category': 'sandwich',
        'description': 'Triple-layered toasted bread with cucumber, tomato & mint spread',
        'price': 95,
        'cost_price': 30,
        'gst': 5,
        'stock': 30,
        'min_stock': 10,
        'image': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-11',
        'name': 'Peri Peri French Fries',
        'category': 'fries',
        'description': 'Crispy skin-on potato fries tossed in zesty African peri-peri spices',
        'price': 85,
        'cost_price': 25,
        'gst': 5,
        'stock': 50,
        'min_stock': 15,
        'image': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-12',
        'name': 'Cheesy Loaded Nachos',
        'category': 'snacks',
        'description': 'Crisp corn tortilla chips drenched in warm cheddar & salsa',
        'price': 120,
        'cost_price': 40,
        'gst': 5,
        'stock': 30,
        'min_stock': 10,
        'image': 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-13',
        'name': 'Burger + Fries + Coke Combo',
        'category': 'combos',
        'description': 'Classic Veg Burger served with medium fries and chilled cola',
        'price': 210,
        'cost_price': 75,
        'gst': 5,
        'stock': 30,
        'min_stock': 10,
        'image': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-14',
        'name': 'Sizzling Brownie with Ice Cream',
        'category': 'desserts',
        'description': 'Fudgy walnut chocolate brownie with vanilla ice cream and fudge',
        'price': 120,
        'cost_price': 45,
        'gst': 5,
        'stock': 25,
        'min_stock': 8,
        'image': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
    {
        'id': 'prod-15',
        'name': 'Choco Lava Cake',
        'category': 'desserts',
        'description': 'Warm molten chocolate cake with gooey runny center',
        'price': 95,
        'cost_price': 35,
        'gst': 5,
        'stock': 20,
        'min_stock': 5,
        'image': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
        'available': True,
    },
]

def seed():
    print("Seeding Categories...")
    for c in CATEGORIES:
        Category.objects.update_or_create(id=c['id'], defaults=c)
    print(f"Categories seeded: {Category.objects.count()}")

    print("Seeding Products...")
    for p in PRODUCTS:
        Product.objects.update_or_create(id=p['id'], defaults=p)
    print(f"Products seeded: {Product.objects.count()}")

    # Seed Walk-in Customer
    Customer.objects.get_or_create(
        phone='9999999999',
        defaults={'name': 'Walk-in Customer', 'total_orders': 0, 'total_spent': 0}
    )
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
