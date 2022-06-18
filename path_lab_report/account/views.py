from django.shortcuts import render
from account.models import Account, Patient
from account.serialiazers import \
    AccountSerializer, \
    PatientSerializer, \
    LoginSerializer, \
    RegistrationSerializer, \
    RegistrationPatientSerializer
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


class AccountViewSet(LoginRequiredMixin, ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    login_url = '/login/'



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
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    login_url = '/login/'

    def update(self, request, *args, **kwargs):
        if "password" in request.data:
            password = request.data['password']
            request.data["password"] = make_password(password)
        return super().update(request, *args, **kwargs)


    @staticmethod
    @api_view(['GET'])
    def get_all_reports(request, username):

        reports = Report.objects.all().filter(account_id__username=username)
        reports_serialized = ReportSerializer(list(reports), many=True)
        if reports_serialized.data:
            return Response(reports_serialized.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)


class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)
    http_method_names = ["post", "patch"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
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


class RegistrationPatientViewSet(RegistrationViewSet):
    serializer_class = RegistrationPatientSerializer


class LoginViewSet(ModelViewSet):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = Account.objects.get(username=serializer.validated_data['user']['username'])
            login(request, user)  # TODO check this
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


def logout_user(request):
    logout(request)
    return redirect('/login/')
