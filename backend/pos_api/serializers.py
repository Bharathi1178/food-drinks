from rest_framework import serializers
from .models import Category, Product, Customer, Order, InventoryLog, Employee
from django.db import transaction

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'color', 'active']


class ProductSerializer(serializers.ModelSerializer):
    costPrice = serializers.DecimalField(source='cost_price', max_digits=10, decimal_places=2, required=False)
    minStock = serializers.IntegerField(source='min_stock', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description', 'price',
            'cost_price', 'costPrice', 'gst', 'stock',
            'min_stock', 'minStock', 'image', 'available'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ensure float/number representation for price
        try:
            ret['price'] = float(instance.price)
        except (ValueError, TypeError):
            pass
        return ret


class CustomerSerializer(serializers.ModelSerializer):
    totalOrders = serializers.IntegerField(source='total_orders', read_only=True)
    totalSpent = serializers.DecimalField(source='total_spent', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone', 'email', 'location', 'address', 'total_orders', 'totalOrders', 'total_spent', 'totalSpent', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    tokenNo = serializers.CharField(source='token_no', required=False, allow_blank=True)
    orderType = serializers.CharField(source='order_type', required=False, default='Delivery', allow_blank=True)
    tableNo = serializers.CharField(source='table_no', required=False, default='', allow_blank=True)
    customerName = serializers.CharField(source='customer_name', required=False, default='Customer', allow_blank=True)
    customerPhone = serializers.CharField(source='customer_phone', required=False, default='', allow_blank=True)
    grandTotal = serializers.DecimalField(source='grand_total', max_digits=10, decimal_places=2, required=False)
    paymentMethod = serializers.CharField(source='payment_method', required=False, default='Cash on Delivery', allow_blank=True)
    paymentStatus = serializers.CharField(source='payment_status', required=False, default='Pending (Pay on Delivery)', allow_blank=True)
    cashierName = serializers.CharField(source='cashier_name', required=False, default='Online App', allow_blank=True)
    amountReceived = serializers.DecimalField(source='amount_received', max_digits=10, decimal_places=2, required=False, default=0)
    changeDue = serializers.DecimalField(source='change_due', max_digits=10, decimal_places=2, required=False, default=0)
    transactionId = serializers.CharField(source='transaction_id', required=False, default='', allow_blank=True)
    status = serializers.CharField(required=False, default='PLACED', allow_blank=True)
    deliveryAddress = serializers.CharField(source='delivery_address', required=False, allow_blank=True)
    deliveryDistrict = serializers.CharField(source='delivery_district', required=False, allow_blank=True)
    deliveryArea = serializers.CharField(source='delivery_area', required=False, allow_blank=True)
    deliveryLandmark = serializers.CharField(source='delivery_landmark', required=False, allow_blank=True)
    deliveryBuildingDetails = serializers.CharField(source='delivery_building_details', required=False, allow_blank=True)
    deliveryInstructions = serializers.CharField(source='delivery_instructions', required=False, allow_blank=True)
    acceptedByEmployeeId = serializers.CharField(source='accepted_by_employee_id', required=False, allow_blank=True)
    acceptedByEmployeeName = serializers.CharField(source='accepted_by_employee_name', required=False, allow_blank=True)
    acceptedAt = serializers.DateTimeField(source='accepted_at', required=False, allow_null=True)
    preparedAt = serializers.DateTimeField(source='prepared_at', required=False, allow_null=True)
    packedAt = serializers.DateTimeField(source='packed_at', required=False, allow_null=True)
    dispatchedAt = serializers.DateTimeField(source='dispatched_at', required=False, allow_null=True)
    deliveredAt = serializers.DateTimeField(source='delivered_at', required=False, allow_null=True)
    cancelledAt = serializers.DateTimeField(source='cancelled_at', required=False, allow_null=True)
    cancellationReason = serializers.CharField(source='cancellation_reason', required=False, allow_blank=True)
    returnReason = serializers.CharField(source='return_reason', required=False, allow_blank=True)
    riderName = serializers.CharField(source='rider_name', required=False, allow_blank=True)
    riderPhone = serializers.CharField(source='rider_phone', required=False, allow_blank=True)
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'token_no', 'tokenNo', 'order_type', 'orderType',
            'table_no', 'tableNo', 'customer_name', 'customerName',
            'customer_phone', 'customerPhone', 'subtotal', 'discount',
            'tax', 'grand_total', 'grandTotal', 'payment_method', 'paymentMethod',
            'payment_status', 'paymentStatus', 'cashier_name', 'cashierName',
            'amount_received', 'amountReceived', 'change_due', 'changeDue',
            'transaction_id', 'transactionId', 'status', 'items',
            'delivery_address', 'deliveryAddress',
            'delivery_district', 'deliveryDistrict',
            'delivery_area', 'deliveryArea',
            'delivery_landmark', 'deliveryLandmark',
            'delivery_building_details', 'deliveryBuildingDetails',
            'delivery_instructions', 'deliveryInstructions',
            'accepted_by_employee_id', 'acceptedByEmployeeId',
            'accepted_by_employee_name', 'acceptedByEmployeeName',
            'accepted_at', 'acceptedAt',
            'prepared_at', 'preparedAt',
            'packed_at', 'packedAt',
            'dispatched_at', 'dispatchedAt',
            'delivered_at', 'deliveredAt',
            'cancelled_at', 'cancelledAt',
            'cancellation_reason', 'cancellationReason',
            'return_reason', 'returnReason',
            'rider_name', 'riderName',
            'rider_phone', 'riderPhone',
            'created_at', 'date', 'time'
        ]

    def get_date(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%Y-%m-%d')
        return ''

    def get_time(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%I:%M %p')
        return ''

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'customer_name' in data and 'customerName' not in data:
            data['customerName'] = data['customer_name']
        if 'order_type' in data and 'orderType' not in data:
            data['orderType'] = data['order_type']
        if 'table_no' in data and 'tableNo' not in data:
            data['tableNo'] = data['table_no']
        if 'customer_phone' in data and 'customerPhone' not in data:
            data['customerPhone'] = data['customer_phone']
        if 'grand_total' in data and 'grandTotal' not in data:
            data['grandTotal'] = data['grand_total']
        if 'payment_method' in data and 'paymentMethod' not in data:
            data['paymentMethod'] = data['payment_method']
        if 'payment_status' in data and 'paymentStatus' not in data:
            data['paymentStatus'] = data['payment_status']
        if 'cashier_name' in data and 'cashierName' not in data:
            data['cashierName'] = data['cashier_name']
        if 'delivery_address' in data and 'deliveryAddress' not in data:
            data['deliveryAddress'] = data['delivery_address']
        if 'delivery_district' in data and 'deliveryDistrict' not in data:
            data['deliveryDistrict'] = data['delivery_district']
        if 'delivery_area' in data and 'deliveryArea' not in data:
            data['deliveryArea'] = data['delivery_area']
        if 'delivery_landmark' in data and 'deliveryLandmark' not in data:
            data['deliveryLandmark'] = data['delivery_landmark']
        if 'delivery_building_details' in data and 'deliveryBuildingDetails' not in data:
            data['deliveryBuildingDetails'] = data['delivery_building_details']
        if 'delivery_instructions' in data and 'deliveryInstructions' not in data:
            data['deliveryInstructions'] = data['delivery_instructions']
        return super().to_internal_value(data)

    def create(self, validated_data):
        items = validated_data.get('items', [])
        
        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            
            # Deduct inventory stock for each item in the order
            for item in items:
                p_id = item.get('id') or item.get('product_id')
                qty = int(item.get('quantity', 1))
                if p_id:
                    try:
                        product = Product.objects.get(id=p_id)
                        old_stock = product.stock
                        new_stock = max(0, old_stock - qty)
                        product.stock = new_stock
                        if new_stock == 0:
                            product.available = False
                        product.save()

                        InventoryLog.objects.create(
                            product_id=str(p_id),
                            product_name=product.name,
                            type='POS Deduction',
                            quantity=-qty,
                            previous_stock=old_stock,
                            new_stock=new_stock,
                            reason=f"Order {order.id} sale"
                        )
                    except Product.DoesNotExist:
                        pass

            # Update or create customer
            c_phone = order.customer_phone
            c_name = order.customer_name
            if c_phone and c_phone != '9999999999':
                cust, created = Customer.objects.get_or_create(
                    phone=c_phone,
                    defaults={'name': c_name, 'total_orders': 1, 'total_spent': order.grand_total}
                )
                if not created:
                    cust.total_orders += 1
                    cust.total_spent += order.grand_total
                    if c_name and c_name != 'Walk-in Customer':
                        cust.name = c_name
                    cust.save()

        return order

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Ensure numbers are floats
        for field in ['subtotal', 'discount', 'tax', 'grand_total', 'grandTotal', 'amount_received', 'amountReceived', 'change_due', 'changeDue']:
            if field in ret and ret[field] is not None:
                try:
                    ret[field] = float(ret[field])
                except (ValueError, TypeError):
                    pass
        return ret


class InventoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryLog
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    joiningDate = serializers.DateField(source='joining_date', read_only=True)
    totalOrdersHandled = serializers.IntegerField(source='total_orders_handled', required=False)
    totalSalesHandled = serializers.DecimalField(source='total_sales_handled', max_digits=12, decimal_places=2, required=False)
    profileInfo = serializers.CharField(source='profile_info', required=False, allow_blank=True)
    recentActivity = serializers.CharField(source='recent_activity', required=False, allow_blank=True)

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'phone', 'email', 'department', 'role',
            'joining_date', 'joiningDate', 'status',
            'total_orders_handled', 'totalOrdersHandled',
            'total_sales_handled', 'totalSalesHandled',
            'availability', 'profile_info', 'profileInfo',
            'recent_activity', 'recentActivity', 'created_at'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        try:
            ret['total_sales_handled'] = float(instance.total_sales_handled)
            ret['totalSalesHandled'] = float(instance.total_sales_handled)
        except (ValueError, TypeError):
            pass
        return ret
