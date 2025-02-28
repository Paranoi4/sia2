
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, TransactionHistoryViewSet, CustomTokenObtainPairView, register_user, logout_user
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register('todo', TodoViewSet, basename='todo')
router.register('transactions', TransactionHistoryViewSet, basename='transactions')


urlpatterns = [
    path('', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT
    path('api/register/', register_user, name='register'),  # User Registration
    path('api/logout/', logout_user, name='logout'),  # Logout (blacklist token)
    
]

