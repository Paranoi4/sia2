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
    transaction_date = models.DateField(null=True, blank=True)  # 🆕 Add this line
    # models.py
    reason = models.TextField(blank=True, null=True)


    

    def __str__(self):
        return f"{self.item_name} - {self.action} on {self.timestamp}"
    

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
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
    ]

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    receipt = models.ImageField(upload_to="receipts/")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')  # ✅ New Field

    def __str__(self):
        return f"Payment for {self.booking.first_name} {self.booking.last_name} - {self.status}"
    

class Package(models.Model):
    pax = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.pax} - ₱{self.price}"
    
class DrinkCategory(models.Model):
    name = models.CharField(max_length=100)  # e.g. "Cocktail"
    items = models.TextField()               # e.g. "Margarita, Mojito, etc."

    def __str__(self):
        return self.name

class ProductAllocation(models.Model):
    package_pax = models.IntegerField()  # Number of pax (e.g. 10, 20, 30)
    product_name = models.CharField(max_length=100)  # Must match Todo.product name
    quantity_per_pax = models.IntegerField()  # How many of this product per pax

    def __str__(self):
        return f"{self.package_pax} pax - {self.product_name} ({self.quantity_per_pax} per pax)"

