from django.contrib import admin
#from . import models
#from .models import Booking, UnavailableDate, Payment
from .models import Booking, UnavailableDate, Payment, Todo

# Register your models here.
class BookingAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "event_date", "available_time", "pax")
    list_filter = ("event_date", "available_time")
    search_fields = ("first_name", "last_name", "email", "phone_number")

# ✅ Admin panel for Unavailable Dates management (Grey Dates)
class UnavailableDateAdmin(admin.ModelAdmin):
    list_display = ("date", "reason")  # Show date & reason in list
    list_filter = ("date",)  # Filter by date
    search_fields = ("date", "reason")  # Search by date or reason

class PaymentAdmin(admin.ModelAdmin):
    list_display = ("booking", "payment_method", "created_at")
    search_fields = ("booking__first_name", "booking__last_name", "payment_method")

admin.site.register(Todo)
admin.site.register(Booking, BookingAdmin)
admin.site.register(UnavailableDate, UnavailableDateAdmin)
admin.site.register(Payment, PaymentAdmin)

