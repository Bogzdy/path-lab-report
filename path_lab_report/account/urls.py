from rest_framework.routers import DefaultRouter
from django.urls import path
from django.contrib.auth.views import auth_logout
from account.views import AccountViewSet,\
    LoginViewSet, \
    RegistrationViewSet,\
    RegistrationPatientViewSet,\
    PatientViewSet, \
    logout_user


account_url_pattern = [
    path('register/doctor', RegistrationViewSet.as_view({'post': 'create'})),
    path('register/patient', RegistrationPatientViewSet.as_view({'post': 'create'})),
    path('login/', LoginViewSet.as_view({'post':'create'})),
    path('logout/', logout_user),
    path('accounts/', AccountViewSet.as_view({'get': 'list'})),
    path('accounts/<int:pk>', AccountViewSet.as_view(actions={'get': 'retrieve'})),
    # TODO Don't know how to make url without update
    path('accounts/update/<int:pk>', AccountViewSet.as_view(actions={'patch': 'partial_update'})),
    path('accounts/delete/<int:pk>', AccountViewSet.as_view({'delete': 'destroy'})),
    path('patients/', PatientViewSet.as_view({'get': 'list'}))
]

# router = DefaultRouter()
# # router.register(r'accounts', acc_view, basename="accounts")
# router.register(r'login', LoginViewSet, basename='login')
# router.register(r'register', RegistrationViewSet, basename='register')
#
# account_url = router.urls
