from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'profile_picture_url', 'phone_number', 'A',
            'initial_portfolio', 'target_portfolio', 'actions', 'riskState', 
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']  # Ensure 'id', 'createdAt', 'updatedAt' are read-only


class UserInputSerializer(serializers.Serializer):
    a = serializers.FloatField()
    stocks = serializers.ListField(
        child=serializers.CharField(),  
        min_length=1,  
        max_length=15,  
    )
    wealth = serializers.FloatField(min_value=0.01)  

class QuestionModelSerializer(serializers.Serializer):
    value = serializers.CharField() 
    score = serializers.IntegerField()  


class QuestionScoresModelSerializer(serializers.Serializer):
    questions = QuestionModelSerializer(many=True)