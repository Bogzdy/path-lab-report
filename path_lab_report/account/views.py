from django.shortcuts import render
from account.models import Account
from account.serialiazers import AccountSerializer, LoginSerializer, RegistrationSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect


class AccountViewSet(LoginRequiredMixin, ModelViewSet):
    serializer_class = AccountSerializer
    queryset = Account.objects.all()
    login_url = '/login/'


class RegistrationViewSet(ModelViewSet, TokenObtainPairView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

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
