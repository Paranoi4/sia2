from django.db import models

# Create your models here.
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
    quantity = models.CharField(max_length=100, null=True, blank=True) # Field for quantity
    #type = models.CharField(max_length=100, null=True, blank=True)  # Field for typ
    type = models.CharField(
        max_length=100,
        choices=TYPE_CHOICES,  # Add choices here
        null=True,
        blank=True
    )

    def __str__(self):
         return self.body


