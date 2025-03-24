from rest_framework import serializers
from . import models
from .models import Todo, TransactionHistory, Booking, UnavailableDate, Payment

class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Todo
        fields = "__all__"
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Format the created field to display only the date
        representation['created'] = instance.created.strftime('%Y-%m-%d')
        return representation
    #new serializers
    
    def create(self, validated_data):
        """Log transaction when an item is added"""
        instance = super().create(validated_data)
        TransactionHistory.objects.create(
            action="Added",
            item_name=instance.body,
            quantity=instance.quantity,
            type=instance.type
        )
        return instance

    def update(self, instance, validated_data):
        """Log transaction when an item is updated"""
        TransactionHistory.objects.create(
            action="Updated",
            item_name=instance.body,
            quantity=validated_data.get("quantity", instance.quantity),
            type=validated_data.get("type", instance.type),
            volume=validated_data.get("volume", instance.volume)
        )
        return super().update(instance, validated_data)
    
class TransactionHistorySerializer(serializers.ModelSerializer):
      class Meta:
        model = TransactionHistory
        fields = "__all__"


# ✅ Serializer for Customer Bookings
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"

# ✅ Serializer for Admin Unavailable Dates
class UnavailableDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableDate
        fields = ["date", "reason"]

# ✅ Serializer for Payments
class PaymentSerializer(serializers.ModelSerializer):
    booking_id = serializers.IntegerField(write_only=True)  # ✅ Used to send booking ID from frontend

    class Meta:
        model = Payment
        fields = ["id", "booking_id", "booking", "payment_method", "receipt", "created_at"]  
        extra_kwargs = {"booking": {"read_only": True}}  # ✅ Prevent booking from being modified manually

    def create(self, validated_data):
        booking_id = validated_data.pop("booking_id", None)

        if not booking_id:
            raise serializers.ValidationError({"booking": ["This field is required."]})

        # ✅ Ensure booking exists
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            raise serializers.ValidationError({"booking": ["Invalid Booking ID."]})

        validated_data["booking"] = booking  # ✅ Attach booking to payment
        return super().create(validated_data)

    def validate_receipt(self, value):
        """✅ Validate uploaded receipt file type."""
        if not value.name.lower().endswith(('.jpg', '.jpeg', '.png', '.pdf')):
            raise serializers.ValidationError("Only JPG, PNG, and PDF files are allowed.")
        return value
