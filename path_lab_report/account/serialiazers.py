import datetime

from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from account.models import Account, Patient
from django.core.exceptions import ValidationError
from django.contrib.auth.models import update_last_login, Group


class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

        def create(self, validated_data):
            return Account(**validated_data)


class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['user'] = AccountSerializer(self.user).data  # TODO Should I return the whole account?
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
        return data


class RegistrationSerializer(AccountSerializer):
    password = serializers.CharField(max_length=30, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True)

    class Meta:
        model = Account
        fields = "__all__"

    def create(self, validated_data):
        if Account.objects.filter(email=validated_data['email']).exists():
            raise ValidationError("Email already exits")
        try:
            user = Account.objects.get(username=validated_data['username'])
        except:
            user = Account.objects.create_user(**validated_data)
            print(f"USER_TYPE: {type(user)}")
        return user


class RegistrationPatientSerializer(RegistrationSerializer, PatientSerializer):
    class Meta:
        model = Patient
        fields = "__all__"

    def create(self, validated_data):
        if Patient.objects.filter(email=validated_data['email']).exists():
            raise ValidationError("Email already exits")
        try:
            patient = Patient.objects.get(username=validated_data['username'])
        except:
            birth_date = validated_data['birth_date']
            if birth_date:
                validated_data['age'] = datetime.datetime.now().year - birth_date.year
            patient = Patient.objects.create_user(**validated_data)
            group = Group.objects.get(name="Patients")
            patient.groups.add(group)
        return patient
