from rest_framework import serializers
from . import models

class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.Todo
        fields = "__all__"
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Format the created field to display only the date
        representation['created'] = instance.created.strftime('%Y-%m-%d')
        return representation
