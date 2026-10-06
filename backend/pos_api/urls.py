from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    ProductViewSet,
    CustomerViewSet,
    OrderViewSet,
    EmployeeViewSet,
    employee_login,
    admin_login,
    admin_dashboard_stats,
    admin_reports,
    payment_process,
    auth_login,
    auth_user,
    send_otp_view,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('employee/login/', employee_login, name='employee-login'),
    path('employee/login', employee_login, name='employee-login-no-slash'),
    path('admin/login/', admin_login, name='admin-login'),
    path('admin/login', admin_login, name='admin-login-no-slash'),
    path('admin/dashboard/', admin_dashboard_stats, name='admin-dashboard'),
    path('admin/dashboard', admin_dashboard_stats, name='admin-dashboard-no-slash'),
    path('admin/reports/', admin_reports, name='admin-reports'),
    path('admin/reports', admin_reports, name='admin-reports-no-slash'),
    path('auth/login/', auth_login, name='auth-login'),
    path('auth/login', auth_login, name='auth-login-no-slash'),
    path('auth/user/', auth_user, name='auth-user'),
    path('auth/send-otp/', send_otp_view, name='auth-send-otp'),
    path('auth/send-otp', send_otp_view, name='auth-send-otp-no-slash'),
    path('payments/process/', payment_process, name='payment-process'),
    path('payments/process', payment_process, name='payment-process-no-slash'),
    path('', include(router.urls)),
]
