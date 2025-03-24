
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, TransactionHistoryViewSet, CustomTokenObtainPairView, protected_view, BookingView, UnavailableDatesView, AdminUnavailableDateView, PaymentView, CleanupExpiredBookings
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register('todo', TodoViewSet, basename='todo')
router.register('transactions', TransactionHistoryViewSet, basename='transactions')


urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected_view'),  # Test protected route
    path("bookings/", BookingView.as_view(), name="bookings"),
    path("unavailable-dates/", UnavailableDatesView.as_view(), name="unavailable_dates"),
    path("admin/unavailable-dates/", AdminUnavailableDateView.as_view(), name="admin_unavailable_dates"),
    path("payments/", PaymentView.as_view(), name="payments"),  # ✅ Add Payment API
    path("cleanup-expired-bookings/", CleanupExpiredBookings.as_view(), name="cleanup_expired_bookings"),  # ✅ Auto-Cleanup API
]

