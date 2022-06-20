import datetime

from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from account.models import Account, Patient
from django.core.exceptions import ValidationError
from django.contrib.auth.models import update_last_login, Group


# class AccountSerializer(ModelSerializer):
#     username = serializers.CharField(max_length=50)
#     password = serializers.CharField(max_length=30, min_length=8, write_only=True, required=True)
#     email = serializers.EmailField(required=True, write_only=True)
#     doctor_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
#
#
#     class Meta:
#         model = Account
#         fields = '__all__'
#
#     def create(self, validated_data):
#         if Account.objects.filter(email=validated_data['email']).exists():
#             raise ValidationError("Email already exits")
#
#         if Account.objects.filter(username=validated_data['username']).exists():
#             raise ValidationError("Username already exits")
#
#         validated_data['is_staff'] = True
#         return Account.objects.create_user(**validated_data)


# class PatientSerializer(AccountSerializer):
#     patient_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
#     account = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
#
#     class Meta:
#         model = Patient
#         fields = '__all__'
#
#     def create(self, validated_data):
#         if Account.objects.filter(email=validated_data['email']).exists():
#             raise ValidationError("Email already exits")
#
#         if Account.objects.filter(username=validated_data['username']).exists():
#             raise ValidationError("Username already exits")
#
#         # create account/user
#         account = Account.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password']
#         )
#         # get the fields specific for patient from validated_data
#         birth_date = validated_data.get('birth_date', None)
#         medical_history = validated_data['medical_history'] if 'medical_history' in validated_data else None
#         age = None
#         if birth_date:
#             days = datetime.datetime.now().toordinal() - birth_date.toordinal()
#             age = days // 365
#         patient = Patient(
#             account=account,
#             birth_date=birth_date,
#             medical_history=medical_history,
#             age=age
#         )
#         patient.save()
#         return patient

# test - use only one serializer for both user models
class PatientSerializer(ModelSerializer):
    patient_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = ['birth_date', 'age', 'medical_history', 'patient_reports']

    # def create(self, validated_data):
    #     if Account.objects.filter(email=validated_data['email']).exists():
    #         raise ValidationError("Email already exits")
    #
    #     if Account.objects.filter(username=validated_data['username']).exists():
    #         raise ValidationError("Username already exits")
    #
    #     # create account/user
    #     account = Account.objects.create_user(
    #         username=validated_data['username'],
    #         email=validated_data['email'],
    #         password=validated_data['password']
    #     )
    #     # get the fields specific for patient from validated_data
    #     birth_date = validated_data.get('birth_date', None)
    #     medical_history = validated_data['medical_history'] if 'medical_history' in validated_data else None
    #     age = None
    #     if birth_date:
    #         days = datetime.datetime.now().toordinal() - birth_date.toordinal()
    #         age = days // 365
    #     patient = Patient(
    #         account=account,
    #         birth_date=birth_date,
    #         medical_history=medical_history,
    #         age=age
    #     )
    #     patient.save()
    #     return patient


# class PatientRelatedField(serializers.RelatedField):
#
#     def to_representation(self, value):


class AccountSerializer(ModelSerializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(max_length=30, min_length=8, write_only=True, required=True)
    email = serializers.EmailField(required=True, write_only=True)
    doctor_reports = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # patient = serializers.PrimaryKeyRelatedField(many=False, required=False, queryset=PatientSerializer)
    patient = PatientSerializer(many=False, required=False)

    class Meta:
        model = Account
        fields = '__all__'

    def create(self, validated_data):
        print(f' valid_data - {validated_data}')
        if Account.objects.filter(email=validated_data['email']).exists():
            raise ValidationError("Email already exits")

        if Account.objects.filter(username=validated_data['username']).exists():
            raise ValidationError("Username already exits")

        if validated_data["is_staff"]:
            account = Account.objects.create_user(**validated_data)
        else:
            if validated_data['patient']:
                patient = Patient(**validated_data.pop('patient'))
                account = Account.objects.create_user(patient=patient, **validated_data)
            else:
                account = Account.objects.create_user(account=None, **validated_data)

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
