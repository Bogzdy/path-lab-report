from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from account.models import Account, Patient
from django.core.exceptions import ValidationError
from django.contrib.auth.models import update_last_login, Group
from django.contrib.auth.hashers import make_password
from account.utils.account_utils import get_age_from_date


class PatientSerializer(ModelSerializer):
    patient_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = ['birth_date', 'age', 'medical_history', 'patient_reports']


class AccountSerializer(ModelSerializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=30, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True)
    doctor_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    patient = PatientSerializer(many=False, required=False)

    class Meta:
        model = Account
        fields = '__all__'

    def update(self, instance, validated_data):
        if Account.objects.filter(email=validated_data.get('email')).exclude(username=instance.username).exists():
            raise ValidationError("Email already exits")
        if Account.objects.filter(username=validated_data.get('username')).exclude(username=instance.username).exists():
            raise ValidationError("Username already exits")

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data.get('password'))  # TODO configure password validation

        if not instance.is_staff:
            if 'patient' not in validated_data:
                validated_data['patient'] = {}
            instance.patient.birth_date = validated_data.get('patient').get('birth_date')
            instance.patient.age = get_age_from_date(instance.patient.birth_date)
            instance.patient.medical_history = validated_data.get('patient').get('medical_history')
            instance.patient.save()
        instance.save()
        return instance

    def create(self, validated_data):
        if Account.objects.filter(email=validated_data['email']).exists():
            raise ValidationError("Email already exits")

        if Account.objects.filter(username=validated_data['username']).exists():
            raise ValidationError("Username already exits")

        if validated_data.get('is_staff'):
            account = Account.objects.create_user(**validated_data)
        else:
            if "patient" in validated_data:
                validated_data['patient']['age'] = get_age_from_date(validated_data['patient']['birth_date'])
                patient = Patient(**validated_data.pop('patient'))
                account = Account.objects.create_user(patient=patient, **validated_data)
            else:
                patient = Patient()
                account = Account.objects.create_user(patient=patient, **validated_data)

            patient.save()

        return account


class AccountLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # generate toke for the user passed
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        # serialize the user
        user = AccountSerializer(self.user).data

        data['user'] = user  # TODO Should I return the whole account?
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
        return data
