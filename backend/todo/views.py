from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from . import serializers
from . import models
from .models import Todo, TransactionHistory, Booking, UnavailableDate, Payment
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .serializers import BookingSerializer, UnavailableDateSerializer, PaymentSerializer, PackageSerializer, DrinkCategorySerializer
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import timedelta
from rest_framework.generics import ListCreateAPIView
from django.core.mail import send_mail  #added 4:30 pm 
from django.conf import settings #added 4:30 pm 
from .models import Package, DrinkCategory





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
        '''
        models.TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type,
            volume=todo_item.volume
        )
        '''
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
        '''
        # Log update for tracking purposes
        TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
        )
        '''
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
        todo_item.quantity = str(current_quantity + stock_return_quantity)
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
        '''
        # Log update
        TransactionHistory.objects.create(
            action="Updated",
            item_name=todo_item.body,
            quantity=todo_item.quantity,
            type=todo_item.type
        )
        '''
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


class BookingView(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Save booking as unconfirmed (pending)
            booking = serializer.save(confirmed=False)  # Mark as pending
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# ✅ View to Fetch Unavailable Dates (Red = Customers, Grey = Admin)
class UnavailableDatesView(APIView):
    def get(self, request, format=None):
        # Fetch all confirmed bookings (fully booked)
        confirmed_bookings = Booking.objects.filter(confirmed=True).values_list("event_date", flat=True).distinct()
        
        # Fetch all pending bookings (booked but not confirmed yet AND not denied)
        pending_bookings = Booking.objects.filter(confirmed=False, payment__status="pending").values_list("event_date", flat=True).distinct()
        
        # Fetch all admin-marked unavailable dates
        admin_unavailable = UnavailableDate.objects.values_list("date", flat=True).distinct()
        
        return Response({
            "confirmed_dates": list(confirmed_bookings),
            "pending_dates": list(pending_bookings),  # No denied dates should appear here
            "admin_unavailable_dates": list(admin_unavailable)
        })


# ✅ View for Admin to Manually Set Unavailable Dates (Grey Dates)
class AdminUnavailableDateView(APIView):
    def get(self, request):
        dates = UnavailableDate.objects.all()
        serializer = UnavailableDateSerializer(dates, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UnavailableDateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UnavailableDateDeleteView(APIView):
    def delete(self, request, date_id):
        date = get_object_or_404(UnavailableDate, id=date_id)
        date.delete()
        return Response({"message": "Unavailable date deleted."}, status=status.HTTP_200_OK)

class UnavailableDateUpdateView(APIView):
    def put(self, request, date_id):
        date = get_object_or_404(UnavailableDate, id=date_id)
        serializer = UnavailableDateSerializer(date, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Payment Processing API View (Fixes Booking Reference Issue)
class PaymentView(ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        print("📥 Incoming Payment Data:", request.data)
        booking_id = request.data.get("booking")

        if not booking_id:
            return Response({"error": "Booking ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Invalid Booking ID."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(booking=booking)
            return Response({"message": "Payment submitted successfully!"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    
class CleanupExpiredBookings(APIView):
    def delete(self, request):
        expiration_time = now() - timedelta(minutes=20)
        expired_bookings = Booking.objects.filter(confirmed=False, created_at__lt=expiration_time)

        if expired_bookings.exists():
            count = expired_bookings.count()
            expired_bookings.delete()
            return Response({"message": f"{count} expired bookings removed."}, status=status.HTTP_200_OK)
        
        return Response({"message": "No expired bookings found."}, status=status.HTTP_200_OK)
    


class AdminApprovePaymentView(APIView):
    def post(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        action = request.data.get("action")

        if action == "approve":
            payment.status = "approved"
            payment.booking.confirmed = True
            payment.booking.save()
            payment.save(update_fields=["status"])
            return Response({"message": "Payment approved successfully."}, status=status.HTTP_200_OK)

        elif action == "deny":
            booking = payment.booking

            # ✅ Mark the payment as denied (Keep the payment data but free the date)
            payment.status = "denied"
            payment.save(update_fields=["status"])

            # ✅ Do NOT set booking.confirmed to False. Keep the booking data intact.
            # ✅ Just free the date by not including it in `greenDates`.

            return Response({
                "message": "Payment denied. Booking retained but date freed.",
                "freed_date": booking.event_date.isoformat()
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)




class PaymentStatusView(APIView):
    def get(self, request, booking_id):
        payment = get_object_or_404(Payment, booking__id=booking_id)
        return Response({"status": payment.status}) 
            
class DeleteUnpaidBookingView(APIView):
    def delete(self, request, booking_id):
        try:
            booking = get_object_or_404(Booking, id=booking_id, confirmed=False)  # Only delete if NOT confirmed
            booking.delete()
            return Response({"message": "Booking deleted successfully."}, status=200)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found or already confirmed."}, status=404)

# ✅ Fetch all Payments (For Viewing in Admin Panel)
class PaymentListView(APIView):
    def get(self, request):
        payments = Payment.objects.select_related("booking").all().order_by("-created_at")
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

class PaymentDetailView(APIView):
    def get(self, request, payment_id):
        payment = get_object_or_404(Payment, id=payment_id)
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)
    

class PaymentCreateView(ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    parser_classes = (MultiPartParser, FormParser)  # ✅ Allow file uploads

    def create(self, request, *args, **kwargs):
        print("📥 Incoming Payment Data:", request.data)  # ✅ Debugging Log

        booking_id = request.data.get("booking_id")  # ✅ Match frontend field

        if not booking_id:
            print("🚨 ERROR: Missing booking ID in request:", request.data)  # ✅ Debugging Log
            return Response({"error": "Booking ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Invalid Booking ID."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            payment = serializer.save(booking=booking)
            return Response({"message": "Payment submitted successfully!"}, status=status.HTTP_201_CREATED)

        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class DrinkCategoryViewSet(viewsets.ModelViewSet):
    queryset = DrinkCategory.objects.all()
    serializer_class = DrinkCategorySerializer

@api_view(["POST"])
def approve_payment(request, payment_id):
    try:
        payment = Payment.objects.get(id=payment_id)
        payment.booking.confirmed = True
        payment.booking.save()
        return Response({"message": "Payment approved successfully!"}, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
    

class PaymentDeleteView(APIView):
    def delete(self, request, payment_id):
        try:
            payment = get_object_or_404(Payment, id=payment_id)
            payment.delete()
            return Response({"message": "Payment deleted successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
