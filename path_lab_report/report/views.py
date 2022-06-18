from django.shortcuts import render, get_object_or_404
from django.contrib.auth.mixins import PermissionRequiredMixin

from report.models import Report
from report.serializers import ReportSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import DjangoModelPermissions, IsAdminUser, IsAuthenticated, DjangoObjectPermissions
from rest_framework.response import Response
from rest_framework import status
from report.permissions import ReportCurrentPatientViewPermission


# Create your views here.
class ReportViewSet(ReportCurrentPatientViewPermission, ModelViewSet ):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [ReportCurrentPatientViewPermission]


    # Override this to populate database using a list of reports
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, many=True)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)
