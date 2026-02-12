from django.db import models

# User model with portfolios and actions stored in JSON fields
class User(models.Model):
    username = models.CharField(max_length=255) 
    email = models.EmailField(unique=True)
    profile_picture_url = models.CharField(max_length=512, null=True, blank=True, default="")
    phone_number = models.CharField(max_length=20, null=True, blank=True, default="")
    A = models.FloatField(null=True, default=-1)

    # Using JSONField for portfolios and actions (to store dict-like structures)
    initial_portfolio = models.JSONField(default=dict)  
    target_portfolio = models.JSONField(default=dict)   
    actions = models.JSONField(default=dict)           

    riskState = models.JSONField(default=dict)  

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username 

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
