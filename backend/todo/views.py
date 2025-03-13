from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from . import serializers
from . import models
from .models import Todo, TransactionHistory
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate


class TodoViewSet(viewsets.ModelViewSet):
    queryset = models.Todo.objects.all()
    serializer_class = serializers.TodoSerializer


    

    def create(self, request, *args, **kwargs):
        """Log transaction when a new Todo item is added."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()  # Save Todo item

            # Safeguard: Check if a similar log already exists
            if not models.TransactionHistory.objects.filter(
                action="Added",
                item_name=instance.body,
                quantity=instance.quantity,
                type=instance.type,
                volume=instance.volume
                
            ).exists():
                models.TransactionHistory.objects.create(
                    action="Added",
                    item_name=instance.body,
                    quantity=instance.quantity,
                    type=instance.type,
                    volume=instance.volume
                    
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Log transaction when a Todo item is updated."""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            updated_instance = serializer.save()            
            # Safeguard: Check if a similar log already exists
            if not models.TransactionHistory.objects.filter(
                action="Updated",
                item_name=updated_instance.body,
                quantity=updated_instance.quantity,
                type=updated_instance.type,
                volume=updated_instance.volume
            ).exists():
                models.TransactionHistory.objects.create(
                    action="Updated",
                    item_name=updated_instance.body,
                    quantity=updated_instance.quantity,
                    type=updated_instance.type,
                    volume=updated_instance.volume
                )

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """Log transaction when a Todo item is deleted."""
        instance = self.get_object()

        # Log "Deleted" transaction
        models.TransactionHistory.objects.create(
            action="Deleted",
            item_name=instance.body,
            quantity=instance.quantity,
            type=instance.type
        )

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def stock_out(self, request, pk=None):
        """Reduce stock quantity for a Todo item"""
        todo_item = get_object_or_404(models.Todo, pk=pk)
        stock_out_quantity = int(request.data.get('quantity', 0))

        previous_quantity = todo_item.quantity
        current_quantity = int(todo_item.quantity)

        if stock_out_quantity > current_quantity:
            return Response({"error": "Insufficient stock."}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce stock and save
        todo_item.quantity = str(current_quantity - stock_out_quantity)
        todo_item.save()

        models.TransactionHistory.objects.create(
            action="Stock-Out",
            item_name=todo_item.body,
            previous_quantity=previous_quantity,
            quantity=todo_item.quantity,
            stock_out_quantity=stock_out_quantity,
            type=todo_item.type,
            volume=todo_item.volume
        )

        models.TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type,
            volume=todo_item.volume
        )

        return Response({"message": "Stock updated successfully.",
                         "previous_quantity": previous_quantity,
                         "updated_quantity": todo_item.quantity}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def stock_in(self, request, pk=None):
        """Increase stock quantity for a Todo item"""
        todo_item = get_object_or_404(models.Todo, pk=pk)
        stock_in_quantity = int(request.data.get('quantity', 0))

        if stock_in_quantity <= 0:
            return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        if todo_item.quantity is None:
            todo_item.quantity = "0"

        previous_quantity = todo_item.quantity
        current_quantity = int(todo_item.quantity)

        # Increase stock and save
        todo_item.quantity = str(current_quantity + stock_in_quantity)
        todo_item.save()

        models.TransactionHistory.objects.create(
            action="Stock-In",
            item_name=todo_item.body,
            previous_quantity=previous_quantity,
            quantity=todo_item.quantity,
            type=todo_item.type,
            stock_in_quantity=stock_in_quantity,
            volume=todo_item.volume
        )

        models.TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type,
            volume=todo_item.volume
        )

        return Response({"message": "Stock updated successfully.",
                         "previous_quantity": previous_quantity,
                         "updated_quantity": todo_item.quantity}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=['patch'])
    def stockoutevent(self, request, pk=None):
        """Reduce stock quantity for an event-specific stock-out"""
        todo_item = get_object_or_404(Todo, pk=pk)
        stock_out_quantity = int(request.data.get('quantity', 0))
        previous_quantity = todo_item.quantity
        current_quantity = int(todo_item.quantity)

        if stock_out_quantity > current_quantity:
            return Response({"error": "Insufficient stock for event."}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce stock for the event and save
        todo_item.quantity = str(current_quantity - stock_out_quantity)
        todo_item.save()

        # Log stock-out for an event
        TransactionHistory.objects.create(
            action="Stock-Out-Event",
            item_name=todo_item.body,
            previous_quantity=previous_quantity,
            quantity=todo_item.quantity,
            type=todo_item.type,
            stock_out_quantity=stock_out_quantity
        )

        # Log update for tracking purposes
        TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
        )

        return Response({
            "message": "Stock-out for event updated successfully.",
            "previous_quantity": previous_quantity,
            "updated_quantity": todo_item.quantity
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'])
    def stockinreturn(self, request, pk=None):
        """Subtract stock quantity for returned products"""
        todo_item = get_object_or_404(Todo, pk=pk)
        stock_return_quantity = int(request.data.get('quantity', 0))

        previous_quantity = todo_item.quantity
        current_quantity = int(todo_item.quantity)

        if stock_return_quantity > current_quantity:
            return Response({"error": "Insufficient stock to return."}, status=status.HTTP_400_BAD_REQUEST)

        # Subtract stock due to return and save
        todo_item.quantity = str(current_quantity - stock_return_quantity)
        todo_item.save()

        # Log "Stock-In-Return" transaction
        TransactionHistory.objects.create(
            action="Stock-In-Return",
            item_name=todo_item.body,
            previous_quantity=previous_quantity,
            quantity=todo_item.quantity,
            type=todo_item.type,
            stock_in_quantity=stock_return_quantity
        )

        # Log update
        TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
        )

        return Response({
            "message": "Stock-in return updated successfully.",
            "previous_quantity": previous_quantity,
            "updated_quantity": todo_item.quantity
        }, status=status.HTTP_200_OK)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    """JWT Login API for existing superusers"""
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        response = super().post(request, *args, **kwargs)

        return Response({
            "access": response.data["access"],
            "refresh": response.data["refresh"],
            "username": username,
            "is_superuser": user.is_superuser
        })

# Protected Route Example
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": f"Hello, {request.user.username}! You are authenticated."})


class TransactionHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.TransactionHistory.objects.all().order_by('-timestamp')
    serializer_class = serializers.TransactionHistorySerializer
