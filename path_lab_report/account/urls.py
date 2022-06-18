from rest_framework.routers import DefaultRouter
from django.urls import path
from django.contrib.auth.views import auth_logout
from account.views import AccountViewSet, \
    LoginViewSet, \
    RegistrationViewSet, \
    RegistrationPatientViewSet, \
    PatientViewSet, \
    logout_user

account_url_pattern = [
    # ____________________Register and login Endpoints_____________________
    path('register/account', RegistrationViewSet.as_view({'post': 'create'})),
    path('register/patient', RegistrationPatientViewSet.as_view({'post': 'create'})),
    path('login/', LoginViewSet.as_view({'post': 'create'})),
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
    path('patients/delete/<int:pk>', PatientViewSet.as_view({'delete':'destroy'})),
    # _____________________________Filtering__________________________________
    path('accounts/<slug:username>/reports', AccountViewSet.filter_reports),
    path('patients/<slug:username>/reports', PatientViewSet.get_all_reports),
]

