from django.db import models
import uuid

class Category(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, default='UtensilsCrossed')
    color = models.CharField(max_length=20, default='#f97316')
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"cat-{uuid.uuid4().hex[:8]}"
        if not self.slug:
            self.slug = self.name.lower().replace(' ', '-')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100) # category slug, e.g. 'burgers', 'drinks'
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    gst = models.IntegerField(default=5)
    stock = models.IntegerField(default=50)
    min_stock = models.IntegerField(default=10)
    image = models.TextField(blank=True, default='')
    available = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"prod-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Customer(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, db_index=True)
    email = models.CharField(max_length=100, blank=True, default='')
    location = models.CharField(max_length=150, blank=True, default='')
    address = models.TextField(blank=True, default='')
    total_orders = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id or self.id.startswith('cust-') or self.id.startswith('CUST-'):
            existing_ids = set(Customer.objects.values_list('id', flat=True))
            counter = 101
            while f"AB-{counter}" in existing_ids:
                counter += 1
            self.id = f"AB-{counter}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Order(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    token_no = models.CharField(max_length=20, default='T-01')
    order_type = models.CharField(max_length=30, default='Dine In')
    table_no = models.CharField(max_length=30, blank=True, default='Table 1')
    customer_name = models.CharField(max_length=100, default='Walk-in Customer')
    customer_phone = models.CharField(max_length=20, blank=True, default='9999999999')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=30, default='Cash')
    payment_status = models.CharField(max_length=30, default='Paid')
    cashier_name = models.CharField(max_length=100, default='Counter Staff')
    amount_received = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    change_due = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transaction_id = models.CharField(max_length=100, blank=True, default='')
    status = models.CharField(max_length=30, default='Completed')
    items = models.JSONField(default=list)
    delivery_address = models.TextField(blank=True, default='')
    delivery_district = models.CharField(max_length=100, blank=True, default='')
    delivery_area = models.CharField(max_length=100, blank=True, default='')
    delivery_landmark = models.CharField(max_length=150, blank=True, default='')
    delivery_building_details = models.CharField(max_length=200, blank=True, default='')
    delivery_instructions = models.TextField(blank=True, default='')
    accepted_by_employee_id = models.CharField(max_length=50, blank=True, default='')
    accepted_by_employee_name = models.CharField(max_length=120, blank=True, default='')
    accepted_at = models.DateTimeField(null=True, blank=True)
    prepared_at = models.DateTimeField(null=True, blank=True)
    packed_at = models.DateTimeField(null=True, blank=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True, default='')
    return_reason = models.TextField(blank=True, default='')
    rider_name = models.CharField(max_length=120, blank=True, default='BiteCraze Express Rider')
    rider_phone = models.CharField(max_length=20, blank=True, default='9840123456')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id or (not self.pk and Order.objects.filter(id=self.id).exists()):
            existing_ids = list(Order.objects.values_list('id', flat=True))
            last_num = 1000
            for eid in existing_ids:
                digits = ''.join(c for c in str(eid) if c.isdigit())
                if digits:
                    last_num = max(last_num, int(digits))
            self.id = f"ORD-{last_num + 1}"
        if not self.token_no or self.token_no == 'T-01':
            count = Order.objects.count() + 1
            self.token_no = f"T-{str(count % 100 or 1).zfill(2)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.customer_name} ({self.grand_total})"


class InventoryLog(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    product_id = models.CharField(max_length=50)
    product_name = models.CharField(max_length=150)
    type = models.CharField(max_length=50, default='POS Deduction')
    quantity = models.IntegerField(default=0)
    previous_stock = models.IntegerField(default=0)
    new_stock = models.IntegerField(default=0)
    reason = models.CharField(max_length=200, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = f"log-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)


class Employee(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default='')
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=120, blank=True, default='')
    department = models.CharField(max_length=80, blank=True, default='Kitchen')
    role = models.CharField(max_length=50, default='Cashier') # Manager, Cashier, Kitchen Staff, Delivery Staff
    joining_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=30, default='Active') # Active, Inactive, On Leave
    total_orders_handled = models.IntegerField(default=0)
    total_sales_handled = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    availability = models.CharField(max_length=30, default='Available') # Available, Busy, On Break, Off-duty
    profile_info = models.TextField(blank=True, default='')
    recent_activity = models.CharField(max_length=255, blank=True, default='Clocked in for shift')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            count = Employee.objects.count() + 101
            self.id = f'EMP-{count}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name} ({self.role})'
