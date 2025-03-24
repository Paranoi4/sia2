from django.db import models
from django.utils.timezone import now
from datetime import timedelta


### Inventory Models ###
class Todo(models.Model):
    TYPE_CHOICES = [
        ('Beverage', 'Beverage'),
        ('Fruits', 'Fruits'),
        ('Non-Perishable Item', 'Non-Perishable Item'),
    ]

    body = models.CharField(max_length=300)
    completed = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    quantity = models.CharField(max_length=100, null=True, blank=True)  # Field for quantity
    type = models.CharField(
        max_length=100,
        choices=TYPE_CHOICES,  # Dropdown choices
        null=True,
        blank=True
    )
    volume = models.CharField(max_length=100, null=True, blank=True)
    

    def __str__(self):
         return self.body


### Transaction History Model ###
class TransactionHistory(models.Model):
    ACTION_CHOICES = [
        ('Added', 'Added'),
        ('Updated', 'Updated'),
        ('Deleted', 'Deleted'),
        ('Stock-Out', 'Stock-Out'),
        ('Stock-In', 'Stock-In'),
    ]
    
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    item_name = models.CharField(max_length=300)  # The product name
    quantity = models.CharField(max_length=100, null=True, blank=True)
    previous_quantity = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)  
    stock_out_quantity = models.IntegerField(null=True, blank=True)
    stock_in_quantity = models.IntegerField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    volume = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.item_name} - {self.action} on {self.timestamp}"
    

# ✅ Customer Bookings (Red Dates)
class Booking(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    event_type = models.CharField(max_length=255)
    venue_address = models.TextField()
    event_date = models.DateField()
    available_time = models.CharField(max_length=10)
    contact_number_venue = models.CharField(max_length=15)
    pax = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Remove `default=now`
    confirmed = models.BooleanField(default=False)  # ✅ Check if payment was made

    def is_expired(self):
        return not self.confirmed and (now() - self.created_at > timedelta(minutes=20))

    def __str__(self):
        return f"{self.event_date} - {self.first_name} {self.last_name} ({'Confirmed' if self.confirmed else 'Pending'})"

# ✅ Admin Unavailable Dates (Grey Dates)
class UnavailableDate(models.Model):
    date = models.DateField(unique=True)  # Prevent duplicate unavailable dates
    reason = models.CharField(max_length=255, blank=True, null=True)  # Reason is optional

    def __str__(self):
        return f"{self.date} - {self.reason or 'No reason provided'}"

# ✅ Payment Transactions Model
class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)  # Link to a booking
    payment_method = models.CharField(max_length=50)  # GCASH, BPI, METROBANK
    receipt = models.ImageField(upload_to="receipts/")  # Store receipt images
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for {self.booking.first_name} {self.booking.last_name} - {self.payment_method}"
