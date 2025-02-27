
from django.urls import path, include
from rest_framework import routers
from .views import TodoViewSet, TransactionHistoryViewSet

router = routers.DefaultRouter()
router.register('todo', TodoViewSet, basename='todo')
router.register('transactions', TransactionHistoryViewSet, basename='transactions')


urlpatterns = [
    path('', include(router.urls)),

    
]

