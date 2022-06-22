from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class Account(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField(unique=True)

    class Meta:
        verbose_name = 'Account'

    def __str__(self):
        return self.username


class Patient(models.Model):
    account = models.OneToOneField(Account, on_delete=models.CASCADE, primary_key=True, related_name="patient")
    birth_date = models.DateField(null=True)
    age = models.IntegerField(null=True, blank=True)
    medical_history = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Patient'

    def __str__(self):
        return str(self.account)
