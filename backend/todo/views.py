from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from . import serializers
from . import models



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
                type=instance.type
            ).exists():
                models.TransactionHistory.objects.create(
                    action="Added",
                    item_name=instance.body,
                    quantity=instance.quantity,
                    type=instance.type
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
                type=updated_instance.type
            ).exists():
                models.TransactionHistory.objects.create(
                    action="Updated",
                    item_name=updated_instance.body,
                    quantity=updated_instance.quantity,
                    type=updated_instance.type
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
            type=todo_item.type,
            stock_out_quantity=stock_out_quantity
        )

        models.TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
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
            stock_in_quantity=stock_in_quantity
        )

        models.TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
        )

        return Response({"message": "Stock updated successfully.",
                         "previous_quantity": previous_quantity,
                         "updated_quantity": todo_item.quantity}, status=status.HTTP_200_OK)


class TransactionHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.TransactionHistory.objects.all().order_by('-timestamp')
    serializer_class = serializers.TransactionHistorySerializer
