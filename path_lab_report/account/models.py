from django.db import models
from django.contrib.auth.models import AbstractUser


class Account(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(unique=True)

    class Meta:
        verbose_name = 'Account'

    def __str__(self):
        return self.username


class Patient(Account):
    birth_date = models.DateField(null=True)
    age = models.IntegerField(null=True)
    medical_history = models.TextField(blank=True)



    def __str__(self):
        return self.username
