from django.db import models


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

    def __str__(self):
        return f"{self.item_name} - {self.action} on {self.timestamp}"
