
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, TransactionHistoryViewSet, CustomTokenObtainPairView, protected_view, BookingView, UnavailableDatesView,AdminUnavailableDateView, UnavailableDateDeleteView, UnavailableDateUpdateView, PaymentCreateView, CleanupExpiredBookings, AdminApprovePaymentView, PaymentStatusView, DeleteUnpaidBookingView,PaymentListView,PaymentDetailView, PackageViewSet, DrinkCategoryViewSet, PaymentDeleteView
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register('todo', TodoViewSet, basename='todo')
router.register('transactions', TransactionHistoryViewSet, basename='transactions')
router.register('packages', PackageViewSet, basename='packages')  # 👈 Add this
router.register('drink-categories', DrinkCategoryViewSet, basename='drinkcategory')



urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected_view'),  # Test protected route
    path("bookings/", BookingView.as_view(), name="bookings"),
    path("unavailable-dates/", UnavailableDatesView.as_view(), name="unavailable_dates"),
    path("admin/unavailable-dates/", AdminUnavailableDateView.as_view(), name="admin_unavailable_dates"),
    path("admin/unavailable-dates/<int:date_id>/", UnavailableDateDeleteView.as_view(), name="delete_unavailable_date"),
    path("admin/unavailable-dates/update/<int:date_id>/", UnavailableDateUpdateView.as_view(), name="update_unavailable_date"),
    path("payments/", PaymentCreateView.as_view(), name="payments"), # Only for POST
    path("payments/", PaymentListView.as_view(), name="payment-list"),        # For GET list
    path("payments/<int:payment_id>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("cleanup-expired-bookings/", CleanupExpiredBookings.as_view(), name="cleanup_expired_bookings"),
    path("admin/approve-payment/<int:payment_id>/", AdminApprovePaymentView.as_view(), name="approve_payment"),
    path("payment-status/<int:booking_id>/", PaymentStatusView.as_view(), name="payment_status"),
    path("delete-unpaid-booking/<int:booking_id>/", DeleteUnpaidBookingView.as_view(), name="delete-unpaid-booking"),
    path("payments/delete/<int:payment_id>/", PaymentDeleteView.as_view(), name="payment-delete"),  # ✅ Add this
    
    
    
]
