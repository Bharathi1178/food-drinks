from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db import models
from django.db.models import Q, Sum, Count, Avg, F
from datetime import datetime, date, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import uuid

from .models import Category, Product, Customer, Order, InventoryLog, Employee
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CustomerSerializer,
    OrderSerializer,
    InventoryLogSerializer,
    EmployeeSerializer,
)

def uuid_hex():
    return uuid.uuid4().hex[:8].upper()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)

        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        return queryset


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('-created_at')
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Customer.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(phone__icontains=search) | Q(email__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        phone = data.get('phone', '').strip()
        name = data.get('name', '').strip()
        total_orders = int(data.get('total_orders') or data.get('totalOrders') or 0)
        total_spent = float(data.get('total_spent') or data.get('totalSpent') or 0)

        cust = None
        if phone:
            cust = Customer.objects.filter(phone=phone).first()
        if not cust and name and name.lower() != 'walk-in customer':
            cust = Customer.objects.filter(name__iexact=name).first()

        if cust:
            if name and name.lower() != 'walk-in customer':
                cust.name = name
            if data.get('email'):
                cust.email = data['email']
            if data.get('address'):
                cust.address = data['address']
            if total_orders:
                cust.total_orders = max(cust.total_orders, total_orders)
            if total_spent:
                cust.total_spent = max(float(cust.total_spent), total_spent)
            cust.save()
            return Response(CustomerSerializer(cust).data, status=status.HTTP_200_OK)

        cust = Customer.objects.create(
            name=name or 'Customer',
            phone=phone,
            email=data.get('email', ''),
            address=data.get('address', ''),
            total_orders=total_orders,
            total_spent=total_spent
        )
        return Response(CustomerSerializer(cust).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception:
            pk = kwargs.get('pk', '')
            cust = Customer.objects.filter(Q(id=pk) | Q(phone=pk)).first()
            if cust:
                cust.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        if 'orderType' in data and 'order_type' not in data:
            data['order_type'] = data['orderType']
        if 'tableNo' in data and 'table_no' not in data:
            data['table_no'] = data['tableNo']
        if 'customerName' in data and 'customer_name' not in data:
            data['customer_name'] = data['customerName']
        if 'customerPhone' in data and 'customer_phone' not in data:
            data['customer_phone'] = data['customerPhone']
        if 'grandTotal' in data and 'grand_total' not in data:
            data['grand_total'] = data['grandTotal']
        if 'total' in data and 'grand_total' not in data:
            data['grand_total'] = data['total']
        if 'paymentMethod' in data and 'payment_method' not in data:
            data['payment_method'] = data['paymentMethod']
        if 'paymentStatus' in data and 'payment_status' not in data:
            data['payment_status'] = data['paymentStatus']
        if 'cashierName' in data and 'cashier_name' not in data:
            data['cashier_name'] = data['cashierName']
        if 'amountReceived' in data and 'amount_received' not in data:
            data['amount_received'] = data['amountReceived']
        if 'changeDue' in data and 'change_due' not in data:
            data['change_due'] = data['changeDue']
        if 'transactionId' in data and 'transaction_id' not in data:
            data['transaction_id'] = data['transactionId']

        # If client sent an id that already exists in DB, pop it so a new unique ID is auto-assigned
        if data.get('id') and Order.objects.filter(id=data['id']).exists():
            data.pop('id', None)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Automatically update or create Customer record upon order placement
        cust_phone = (data.get('customer_phone') or data.get('customerPhone') or '').strip()
        cust_name = (data.get('customer_name') or data.get('customerName') or '').strip()
        grand_total = float(data.get('grand_total') or data.get('grandTotal') or data.get('total') or 0)
        delivery_addr = (data.get('deliveryAddress') or data.get('delivery_address') or data.get('address') or '').strip()
        delivery_district = (data.get('deliveryDistrict') or data.get('delivery_district') or '').strip()
        delivery_area = (data.get('deliveryArea') or data.get('delivery_area') or '').strip()
        loc_parts = [p for p in [delivery_area, delivery_district] if p]
        loc_str = ", ".join(loc_parts)
        cust_loc = (data.get('location') or loc_str or '').strip()

        if cust_phone and cust_phone != '9999999999':
            try:
                cust = Customer.objects.filter(phone=cust_phone).first()
                if not cust and cust_name and cust_name.lower() != 'walk-in customer':
                    cust = Customer.objects.filter(name__iexact=cust_name).first()

                if cust:
                    cust.total_orders = (cust.total_orders or 0) + 1
                    cust.total_spent = float(cust.total_spent or 0) + grand_total
                    if delivery_addr:
                        cust.address = delivery_addr
                    if cust_loc:
                        cust.location = cust_loc
                    if cust_name and cust_name.lower() != 'walk-in customer':
                        cust.name = cust_name
                    cust.save()
                elif cust_name and cust_name.lower() != 'walk-in customer':
                    Customer.objects.create(
                        name=cust_name,
                        phone=cust_phone,
                        address=delivery_addr,
                        location=cust_loc,
                        total_orders=1,
                        total_spent=grand_total
                    )
            except Exception:
                pass

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()
        new_status = data.get('status')

        if new_status:
            st = str(new_status).strip().upper()
            now = timezone.now()

            # Map status transitions & update timestamps
            if st in ['ACCEPTED', 'ACCEPT']:
                instance.status = 'ACCEPTED'
                emp_id = data.get('accepted_by_employee_id') or data.get('acceptedByEmployeeId') or data.get('employee_id')
                emp_name = data.get('accepted_by_employee_name') or data.get('acceptedByEmployeeName') or data.get('employee_name')
                if emp_id:
                    instance.accepted_by_employee_id = emp_id
                if emp_name:
                    instance.accepted_by_employee_name = emp_name
                instance.accepted_at = now

            elif st in ['PREPARING', 'START_PREPARING']:
                instance.status = 'PREPARING'
                if not instance.prepared_at:
                    instance.prepared_at = now

            elif st in ['FOOD_READY', 'FOOD READY']:
                instance.status = 'FOOD_READY'
                instance.prepared_at = now

            elif st in ['PACKING', 'START_PACKING']:
                instance.status = 'PACKING'

            elif st in ['READY_FOR_DELIVERY', 'PACKED', 'PACKED & READY']:
                instance.status = 'READY_FOR_DELIVERY'
                instance.packed_at = now

            elif st in ['OUT_FOR_DELIVERY', 'OUT FOR DELIVERY', 'DISPATCHED']:
                instance.status = 'OUT_FOR_DELIVERY'
                instance.dispatched_at = now

            elif st in ['ARRIVED']:
                instance.status = 'ARRIVED'

            elif st in ['DELIVERED', 'COMPLETED']:
                instance.status = 'DELIVERED'
                instance.delivered_at = now
                if 'cash' in str(instance.payment_method).lower():
                    instance.payment_status = 'Paid'

                # Update employee stats
                emp_id = instance.accepted_by_employee_id or data.get('employee_id')
                if emp_id:
                    Employee.objects.filter(Q(id=emp_id) | Q(id__iexact=emp_id)).update(
                        total_orders_handled=models.F('total_orders_handled') + 1,
                        total_sales_handled=models.F('total_sales_handled') + instance.grand_total,
                        recent_activity=f"Delivered order #{instance.id} at {now.strftime('%I:%M %p')}"
                    )

            elif st in ['CANCELLED', 'CANCELED']:
                instance.status = 'CANCELLED'
                instance.cancelled_at = now
                instance.cancellation_reason = data.get('cancellation_reason') or data.get('cancellationReason') or 'Cancelled by user / store'

            elif st in ['RETURN_TO_RESTAURANT', 'RETURNED_TO_RESTAURANT']:
                instance.status = 'RETURNED_TO_RESTAURANT'
                instance.return_reason = data.get('return_reason') or data.get('returnReason') or 'Delivery unsuccessful, returned to restaurant'

            else:
                instance.status = new_status

        if 'payment_status' in data or 'paymentStatus' in data:
            instance.payment_status = data.get('payment_status') or data.get('paymentStatus')
        if 'rider_name' in data or 'riderName' in data:
            instance.rider_name = data.get('rider_name') or data.get('riderName')
        if 'rider_phone' in data or 'riderPhone' in data:
            instance.rider_phone = data.get('rider_phone') or data.get('riderPhone')

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all().order_by('id')
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Employee.objects.all().order_by('id')
        role = self.request.query_params.get('role', None)
        status_param = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)

        if role and role != 'all':
            queryset = queryset.filter(role__iexact=role)
        if status_param and status_param != 'all':
            queryset = queryset.filter(status__iexact=status_param)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(phone__icontains=search) | Q(email__icontains=search) | Q(id__icontains=search)
            )
        return queryset


@api_view(['POST'])
@permission_classes([AllowAny])
def payment_process(request):
    data = request.data
    method = data.get('payment_method', 'Cash')
    amount = data.get('amount', 0)
    tx_id = data.get('transaction_id', f"TXN-{uuid_hex()}")
    
    return Response({
        'success': True,
        'status': 'Approved',
        'transaction_id': tx_id,
        'method': method,
        'amount': amount,
        'message': f'Payment of ₹{amount} received via {method}.'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def auth_login(request):
    data = request.data
    email = data.get('email', 'cashier@bitepos.com')
    return Response({
        'token': 'drf-jwt-pos-terminal-session-key',
        'user': {
            'id': 'usr-1',
            'name': 'Counter Staff',
            'email': email,
            'role': 'Cashier'
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_user(request):
    return Response({
        'id': 'usr-1',
        'name': 'Counter Staff',
        'email': 'cashier@bitepos.com',
        'role': 'Cashier'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    data = request.data or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email:
        return Response({
            'success': False,
            'message': 'Please provide an email or username.'
        }, status=status.HTTP_400_BAD_REQUEST)

    name = 'Admin'

    return Response({
        'success': True,
        'token': 'drf-jwt-director-session-token-' + uuid_hex(),
        'user': {
            'id': 'dir-01',
            'name': name,
            'email': email,
            'role': 'Director',
            'permissions': ['all']
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def employee_login(request):
    data = request.data or {}
    emp_id = (data.get('employee_id') or data.get('id') or data.get('emp_id') or '').strip()
    name = (data.get('name') or data.get('employee_name') or '').strip()
    email = (data.get('email') or data.get('employee_email') or '').strip().lower()

    if not emp_id or not name or not email:
        return Response({
            'success': False,
            'message': 'Please enter your Employee ID, Name, and Email.'
        }, status=status.HTTP_400_BAD_REQUEST)

    id_clean = emp_id.replace('-', '').replace(' ', '').lower()
    employees = Employee.objects.all()
    matched = None
    for emp in employees:
        current_id_clean = emp.id.replace('-', '').replace(' ', '').lower()
        if (current_id_clean == id_clean or emp.id.lower() == emp_id.lower()) and \
           emp.email.strip().lower() == email and \
           name.lower() in emp.name.lower():
            matched = emp
            break

    if not matched:
        id_exists = any(emp.id.replace('-', '').replace(' ', '').lower() == id_clean for emp in employees)
        if id_exists:
            return Response({
                'success': False,
                'message': 'Employee ID matched, but Name or Email does not match Admin employee records.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'success': False,
            'message': f'Employee ID "{emp_id}" not found in restaurant records. Please check with your Store Admin.'
        }, status=status.HTTP_404_NOT_FOUND)

    # Validate Active status strictly
    if matched.status.lower() != 'active':
        return Response({
            'success': False,
            'message': f'Sign-in rejected: Your employee status is "{matched.status}". Only ACTIVE employees can sign in.'
        }, status=status.HTTP_403_FORBIDDEN)

    # Update recent activity
    matched.recent_activity = f"Signed in to Employee Portal at {timezone.now().strftime('%I:%M %p')}"
    matched.save(update_fields=['recent_activity'])

    return Response({
        'success': True,
        'token': f'emp-session-{uuid_hex()}',
        'employee': EmployeeSerializer(matched).data,
        'message': f'Welcome back, {matched.name}!'
    }, status=status.HTTP_200_OK)


def normalize_payment_method(method):
    if not method:
        return 'Cash'
    m = str(method).strip().lower()
    if 'upi' in m or 'gpay' in m or 'phonepe' in m or 'paytm' in m or 'qr' in m:
        return 'UPI'
    if 'card' in m or 'credit' in m or 'debit' in m or 'pos' in m:
        return 'Card'
    return 'Cash'  # Default for Cash, Cash on Delivery, COD, Pay on Delivery


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_dashboard_stats(request):
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)

    all_orders = Order.objects.all()
    today_orders = all_orders.filter(created_at__gte=today_start)
    weekly_orders = all_orders.filter(created_at__gte=week_start)
    monthly_orders = all_orders.filter(created_at__gte=month_start)

    today_turnover = float(today_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)
    weekly_turnover = float(weekly_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)
    monthly_turnover = float(monthly_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)

    today_count = today_orders.count()
    today_aov = round(today_turnover / today_count, 2) if today_count > 0 else 0

    total_orders = all_orders.count()
    total_customers = Customer.objects.count()
    active_employees = Employee.objects.filter(status='Active').count()
    if active_employees == 0 and Employee.objects.exists():
        active_employees = Employee.objects.count()

    recent_orders_qs = all_orders.order_by('-created_at')[:10]
    recent_orders = []
    for o in recent_orders_qs:
        recent_orders.append({
            'id': o.id,
            'customer': o.customer_name,
            'customerPhone': o.customer_phone,
            'date': o.created_at.strftime('%Y-%m-%d') if o.created_at else '',
            'time': o.created_at.strftime('%I:%M %p') if o.created_at else '',
            'amount': float(o.grand_total),
            'paymentMethod': o.payment_method,
            'status': o.status,
            'orderType': o.order_type,
            'acceptedByEmployeeName': o.accepted_by_employee_name,
            'acceptedByEmployeeId': o.accepted_by_employee_id,
        })

    days_data = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        day_orders = all_orders.filter(created_at__date=day_date)
        day_sales = float(day_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)
        days_data.append({
            'date': day_date.strftime('%b %d'),
            'day': day_date.strftime('%a'),
            'turnover': round(day_sales, 2),
            'orders': day_orders.count()
        })

    return Response({
        'today_turnover': round(today_turnover, 2),
        'weekly_turnover': round(weekly_turnover, 2),
        'monthly_turnover': round(monthly_turnover, 2),
        'total_orders': total_orders,
        'total_customers': total_customers,
        'active_employees': active_employees,
        'today_sales': {
            'order_count': today_count,
            'total_sales': round(today_turnover, 2),
            'average_order_value': today_aov
        },
        'recent_orders': recent_orders,
        'sales_overview': days_data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_reports(request):
    period = request.query_params.get('period', 'today')
    selected_date_str = request.query_params.get('date', None)
    now = timezone.now()
    all_orders = Order.objects.all()

    start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = now

    if period == 'yesterday':
        start_date = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(days=1)
    elif period == 'this_week':
        start_date = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == 'last_week':
        end_date = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
        start_date = end_date - timedelta(days=7)
    elif period == 'this_month':
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif period == 'last_month':
        first_of_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_date = first_of_this_month
        last_month_last_day = first_of_this_month - timedelta(days=1)
        start_date = last_month_last_day.replace(day=1)
    elif selected_date_str:
        try:
            parsed = datetime.strptime(selected_date_str, '%Y-%m-%d')
            start_date = timezone.make_aware(parsed.replace(hour=0, minute=0, second=0, microsecond=0))
            end_date = start_date + timedelta(days=1)
        except Exception:
            pass

    filtered_orders = all_orders.filter(created_at__gte=start_date, created_at__lte=end_date)

    total_turnover = float(filtered_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)
    order_count = filtered_orders.count()
    aov = round(total_turnover / order_count, 2) if order_count > 0 else 0

    payments = {'Cash': {'count': 0, 'amount': 0.0}, 'UPI': {'count': 0, 'amount': 0.0}, 'Card': {'count': 0, 'amount': 0.0}}
    for o in filtered_orders:
        method = normalize_payment_method(o.payment_method)
        payments[method]['count'] += 1
        payments[method]['amount'] += float(o.grand_total)

    for k in payments:
        payments[k]['amount'] = round(payments[k]['amount'], 2)

    days_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_breakdown = []
    current_week_start = (now - timedelta(days=now.weekday())).date()
    for idx, day_name in enumerate(days_names):
        d_date = current_week_start + timedelta(days=idx)
        d_orders = all_orders.filter(created_at__date=d_date)
        d_turnover = float(d_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0)
        weekly_breakdown.append({
            'day': day_name,
            'date': d_date.strftime('%Y-%m-%d'),
            'turnover': round(d_turnover, 2),
            'orders': d_orders.count()
        })

    try:
        req_year = int(request.query_params.get('year') or now.year)
    except Exception:
        req_year = now.year
    try:
        req_month = int(request.query_params.get('month') or now.month)
    except Exception:
        req_month = now.month

    month_orders = all_orders.filter(created_at__year=req_year, created_at__month=req_month)
    w1_orders = month_orders.filter(created_at__day__gte=1, created_at__day__lte=7)
    w2_orders = month_orders.filter(created_at__day__gte=8, created_at__day__lte=14)
    w3_orders = month_orders.filter(created_at__day__gte=15, created_at__day__lte=21)
    w4_orders = month_orders.filter(created_at__day__gte=22)

    monthly_weeks = [
        {'label': 'Week 1 (1st - 7th)', 'turnover': round(float(w1_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0), 2), 'orders': w1_orders.count()},
        {'label': 'Week 2 (8th - 14th)', 'turnover': round(float(w2_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0), 2), 'orders': w2_orders.count()},
        {'label': 'Week 3 (15th - 21st)', 'turnover': round(float(w3_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0), 2), 'orders': w3_orders.count()},
        {'label': 'Week 4 (22nd - End)', 'turnover': round(float(w4_orders.aggregate(Sum('grand_total'))['grand_total__sum'] or 0), 2), 'orders': w4_orders.count()},
    ]

    return Response({
        'period': period,
        'total_turnover': round(total_turnover, 2),
        'order_count': order_count,
        'average_order_value': aov,
        'payment_breakdown': payments,
        'weekly_breakdown': weekly_breakdown,
        'monthly_breakdown': monthly_weeks,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_view(request):
    """
    Dispatch OTP verification code directly to customer email.
    Logs to server console and sends via configured mail backend.
    """
    email = request.data.get('email', '').strip()
    otp = request.data.get('otp', '').strip()
    name = request.data.get('name', 'Customer').strip()

    if not email or not otp:
        return Response({'success': False, 'message': 'Email and OTP code are required'}, status=status.HTTP_400_BAD_REQUEST)

    subject = f"Your BiteCraze Verification OTP: {otp}"
    body = (
        f"Hello {name},\n\n"
        f"Your BiteCraze Online Food Delivery verification code is: {otp}\n\n"
        f"Please enter this 6-digit code on the signup page to verify your email address and unlock password setup.\n\n"
        f"Warm regards,\n"
        f"BiteCraze Food & Drinks Team"
    )

    print(f"\n==================================================")
    print(f"[BiteCraze Email Dispatch] TO: {email}")
    print(f"[BiteCraze Email Dispatch] SUBJECT: {subject}")
    print(f"[BiteCraze Email Dispatch] OTP CODE: {otp}")
    print(f"==================================================\n")

    email_sent = False
    try:
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@bitecraze.com')
        send_mail(subject, body, from_email, [email], fail_silently=True)
        email_sent = True
    except Exception as e:
        print(f"[BiteCraze Email Dispatch] Mail send exception: {e}")

    return Response({
        'success': True,
        'email_sent': email_sent,
        'email': email,
        'otp': otp,
        'message': f'Verification OTP dispatched to {email}'
    }, status=status.HTTP_200_OK)
