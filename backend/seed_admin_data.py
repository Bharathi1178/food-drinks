import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitepos_backend.settings')
django.setup()

from pos_api.models import Employee, Customer, Order
from datetime import datetime, timedelta
from django.utils import timezone
import random

# Seed Employees if empty or fewer than 5
if Employee.objects.count() < 5:
    employees = [
        {'id': 'EMP-101', 'name': 'Arjun Verma', 'phone': '9876543201', 'email': 'arjun.manager@bitecraze.com', 'role': 'Manager', 'status': 'Active', 'availability': 'Available', 'total_orders_handled': 342, 'total_sales_handled': 85400.0, 'profile_info': 'General Store Manager overseeing shift operations, inventory auditing, and cash settlements.', 'recent_activity': 'Reviewed weekly sales closing report'},
        {'id': 'EMP-102', 'name': 'Priya Nair', 'phone': '9876543202', 'email': 'priya.nair@bitecraze.com', 'role': 'Cashier', 'status': 'Active', 'availability': 'Busy', 'total_orders_handled': 285, 'total_sales_handled': 64200.0, 'profile_info': 'Front counter cashier handling dine-in and online takeaway orders with high speed.', 'recent_activity': 'Billed order ORD-1002 (UPI payment)'},
        {'id': 'EMP-103', 'name': 'Aarav Patel', 'phone': '9876543203', 'email': 'aarav.pos@bitecraze.com', 'role': 'Cashier', 'status': 'Active', 'availability': 'Available', 'total_orders_handled': 198, 'total_sales_handled': 49100.0, 'profile_info': 'Counter staff & POS operator. Manages daily bill reconciliations.', 'recent_activity': 'Settled shift drawer cash register'},
        {'id': 'EMP-104', 'name': 'Chef Rajesh Kumar', 'phone': '9876543204', 'email': 'rajesh.kitchen@bitecraze.com', 'role': 'Kitchen Staff', 'status': 'Active', 'availability': 'Available', 'total_orders_handled': 420, 'total_sales_handled': 114500.0, 'profile_info': 'Head Chef in charge of Dum Biryani, chicken gravies, and kitchen ingredient staging.', 'recent_activity': 'Prepared 15 portions of Chicken Dum Biryani'},
        {'id': 'EMP-105', 'name': 'Sunil Joshi', 'phone': '9876543205', 'email': 'sunil.kitchen@bitecraze.com', 'role': 'Kitchen Staff', 'status': 'On Leave', 'availability': 'Off-duty', 'total_orders_handled': 180, 'total_sales_handled': 43000.0, 'profile_info': 'Assistant cook handling Dosa, snacks, and deep-fry varieties.', 'recent_activity': 'Applied approved personal leave (returning Monday)'},
        {'id': 'EMP-106', 'name': 'Karthik Raja', 'phone': '9876543206', 'email': 'karthik.delivery@bitecraze.com', 'role': 'Delivery Staff', 'status': 'Active', 'availability': 'Busy', 'total_orders_handled': 215, 'total_sales_handled': 52300.0, 'profile_info': 'Express delivery driver managing direct neighborhood orders.', 'recent_activity': 'Out for delivery on Anna Nagar route'},
        {'id': 'EMP-107', 'name': 'Manoj Kumar', 'phone': '9876543207', 'email': 'manoj.delivery@bitecraze.com', 'role': 'Delivery Staff', 'status': 'Inactive', 'availability': 'Off-duty', 'total_orders_handled': 85, 'total_sales_handled': 19500.0, 'profile_info': 'Part-time weekend delivery associate.', 'recent_activity': 'Off shift schedule'}
    ]
    for emp in employees:
        Employee.objects.update_or_create(id=emp['id'], defaults=emp)
    print('Seeded employees!')

print('SQLite database is primed for director admin dashboard!')
