from django.shortcuts import render
from account.models import Account, Patient
from account.serialiazers import \
    AccountSerializer, \
    PatientSerializer, \
    AccountLoginSerializer
from report.serializers import ReportSerializer
from report.models import Report
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.core.exceptions import ValidationError
from django.db.models.query import QuerySet
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from account.constants import SIGNUP_ENDPOINTS


class AccountViewSet(LoginRequiredMixin, ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    login_url = '/login/'
    permission_classes = []

    def list(self, request, *args, **kwargs):
        accounts = self.queryset.filter(is_staff=True)
        serialized_patients = self.serializer_class(accounts, many=True)
        return Response(serialized_patients.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        if "password" in request.data:
            password = request.data['password']
            request.data["password"] = make_password(password)
        return super().update(request, *args, **kwargs)

    @staticmethod  # TODO Is it wrong to use a static method here?
    @api_view(['GET'])
    def filter_reports(request, username):
        query = Report.objects.all().filter(account_id__username=username)

        gross_exam_q_param = request.query_params.get('gross_exam')
        microscopic_exam_q_param = request.query_params.get('microscopic_exam')
        immuno_examination_q_param = request.query_params.get('immuno_examination')
        special_stain_exam_q_param = request.query_params.get('special_stain_exam')
        diagnosis_q_param = request.query_params.get('diagnosis')
        medical_codes_q_param = request.query_params.get('medical_codes')
        topography_codes_q_param = request.query_params.get('topography_codes')

        if gross_exam_q_param:
            query = query.filter(gross_exam__icontains=gross_exam_q_param)
        if microscopic_exam_q_param:
            query = query.filter(microscopic_exam__icontains=microscopic_exam_q_param)
        if immuno_examination_q_param:
            query = query.filter(immuno_examination__icontains=immuno_examination_q_param)
        if special_stain_exam_q_param:
            query = query.filter(special_stain_exam__icontains=special_stain_exam_q_param)
        if diagnosis_q_param:
            query = query.filter(diagnosis__icontains=diagnosis_q_param)
        if medical_codes_q_param:
            query = query.filter(medical_codes__icontains=medical_codes_q_param)
        if topography_codes_q_param:
            query = query.filter(topography_codes__icontains=topography_codes_q_param)
        reports_serialized = ReportSerializer(list(query), many=True)
        if reports_serialized.data:
            return Response(reports_serialized.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatientViewSet(LoginRequiredMixin, ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    login_url = '/login/'

    def list(self, request, *args, **kwargs):
        patients = self.queryset.filter(is_staff=False)
        serialized_patients = self.serializer_class(patients, many=True)
        return Response(serialized_patients.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        if "password" in request.data:
            password = request.data['password']
            request.data["password"] = make_password(password)
        return super().update(request, *args, **kwargs)

    @staticmethod
    @api_view(['GET'])
    def get_all_reports(request):
        username = request.user
        reports = Report.objects.all().filter(patient_id__username=username)
        reports_serialized = ReportSerializer(list(reports), many=True)
        if reports_serialized.data:
            return Response(reports_serialized.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)


class AccountRegistrationViewSet(ModelViewSet,
                                 TokenObtainPairView):  # TODO Refactor this into AccountViewSet + permissions
    permission_classes = (AllowAny,)
    http_method_names = ["post"]
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    def create(self, request, *args, **kwargs):
        print(f"request {request.path}")
        if SIGNUP_ENDPOINTS['patient'] in request.path:
            request.data['is_staff'] = False
        elif SIGNUP_ENDPOINTS['account'] in request.path:
            request.data['is_staff'] = True

        serializer = AccountSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            refresh_token = RefreshToken.for_user(user)
            res = {
                "refresh": str(refresh_token),
                "access": str(refresh_token.access_token)
            }
        except ValidationError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "account": serializer.data,
            "refresh": res["refresh"],
            "access": res["access"]
        })


class AccountLoginView(ModelViewSet):
    serializer_class = AccountLoginSerializer
    permission_classes = (AllowAny,)
    queryset = Account.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)

            user = self.get_queryset().get(
                username=serializer.validated_data['user']['username'])  # TODO help class field/variable
            login(request, user)  # TODO check this
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


def logout_user(request):
    logout(request)
    return redirect('/login/')

# class PatientRegistrationView(ModelViewSet,
#                               TokenObtainPairView):
#     permission_classes = (AllowAny,)
#     http_method_names = ["post"]
#     serializer_class = AccountSerializer
#     queryset = Account.objects.all()
#
#     def create(self, request, *args, **kwargs):
#         print(f"request {request.path}")
#         if SIGNUP_ENDPOINTS['patient'] in request.path:
#             request.data['is_staff'] = False
#         elif SIGNUP_ENDPOINTS['account'] in request.path:
#             request.data['is_staff'] = True
#
#         serializer = AccountSerializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             user = serializer.save()
#             refresh_token = RefreshToken.for_user(user)
#             res = {
#                 "refresh": str(refresh_token),
#                 "access": str(refresh_token.access_token)
#             }
#         except ValidationError as e:
#             return Response(e, status=status.HTTP_400_BAD_REQUEST)
#
#         return Response({
#             "account": serializer.data,
#             "refresh": res["refresh"],
#             "access": res["access"]
#         })


# def create(self, request, *args, **kwargs):
#     serializer = self.get_serializer(data=request.data)
#     try:
#         serializer.is_valid(raise_exception=True)
#
#         # create a account-patient and save it
#         patient = serializer.save()
#
#         # get the account from the patient and serialize it
#         account_as_model = patient.account
#         serialized_account = AccountSerializer(patient.account).data
#
#         # generate Token for the account
#         refresh_token = RefreshToken.for_user(account_as_model)
#         res = {
#             "refresh": str(refresh_token),
#             "access": str(refresh_token.access_token)
#         }
#     except ValidationError as e:
#         return Response(e, status=status.HTTP_400_BAD_REQUEST)
#
#     return Response({
#         "account": serialized_account,
#         "refresh": res["refresh"],
#         "access": res["access"]
#     })
