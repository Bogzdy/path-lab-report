from rest_framework.routers import DefaultRouter
from django.urls import path
from django.contrib.auth.views import auth_logout
from account.views import AccountViewSet, \
    AccountLoginView, \
    AccountRegistrationViewSet, \
    PatientViewSet, \
    logout_user

SIGNUP_ENDPOINTS = {
    "account": 'account/signup',
    "patient": 'patient/signup'
}

account_url_pattern = [
    # ____________________Register and login Endpoints_____________________
    path(SIGNUP_ENDPOINTS['account'], AccountRegistrationViewSet.as_view({'post': 'create'})),
    path(SIGNUP_ENDPOINTS['patient'], AccountRegistrationViewSet.as_view({'post': 'create'})),
    path('login', AccountLoginView.as_view({'post': 'create'})),
    path('logout/', logout_user),
    # ________________________Accounts Endpoints____________________________
    path('accounts/', AccountViewSet.as_view({'get': 'list'})),
    path('accounts/<int:pk>', AccountViewSet.as_view({'get': 'retrieve'})),
    # TODO Don't know how to make url without update
    path('accounts/update/<int:pk>', AccountViewSet.as_view({'patch': 'partial_update'})),
    path('accounts/delete/<int:pk>', AccountViewSet.as_view({'delete': 'destroy'})),
    # ____________________________Patients___________________________________
    path('patients/', PatientViewSet.as_view({'get': 'list'})),
    path('patients/<int:pk>', PatientViewSet.as_view({'get': 'retrieve'})),
    path('patients/patient', PatientViewSet.as_view({'post': 'create'})),
    path('patients/update/<int:pk>', PatientViewSet.as_view({'patch': 'partial_update'})),
    path('patients/delete/<int:pk>', PatientViewSet.as_view({'delete': 'destroy'})),
    # _____________________________Filtering__________________________________
    path('accounts/<slug:username>/reports', AccountViewSet.filter_reports),
    path('patients/reports', PatientViewSet.get_all_reports),
]
