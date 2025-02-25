from rest_framework import serializers
from . import models
from .models import Todo, TransactionHistory

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
            type=validated_data.get("type", instance.type)
        )
        return super().update(instance, validated_data)
    
class TransactionHistorySerializer(serializers.ModelSerializer):
      class Meta:
        model = TransactionHistory
        fields = "__all__"
