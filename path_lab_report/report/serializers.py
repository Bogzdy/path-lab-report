from rest_framework.serializers import ModelSerializer, ListSerializer
from rest_framework import serializers
from report.models import Report


class ReportSerializerList(ListSerializer):

    def create(self, validated_data):
        reports = [Report(**item) for item in validated_data]
        return Report.objects.bulk_create(reports)


class ReportSerializer(ModelSerializer):
    gross_exam = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    microscopic_exam = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    immuno_examination = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    special_stain_exam = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    diagnosis = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    medical_codes = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    topography_codes = serializers.CharField(allow_null=True, required=False, allow_blank=True)

    class Meta:
        model = Report
        fields = "__all__"
        list_serializer_class = ReportSerializerList
