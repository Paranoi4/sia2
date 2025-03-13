
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, TransactionHistoryViewSet, CustomTokenObtainPairView, protected_view
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register('todo', TodoViewSet, basename='todo')
router.register('transactions', TransactionHistoryViewSet, basename='transactions')


urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', protected_view, name='protected_view'),  # Test protected route
]

