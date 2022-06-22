from report.models import Report
from report.serializers import ReportSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from report.permissions import IsStaffPermission


class ReportViewSet(ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsStaffPermission]

    # Override this to populate database using a list of reports
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data, many=True)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)

    def create(self, request, *args, **kwargs):
        doctor_id = request.user.id
        request.data['doctor'] = doctor_id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['GET'])
    def get_logged_user_reports(self, request):
        pk = request.user.id
        if request.user.is_staff:
            reports = Report.objects.all().filter(doctor_id=pk)
        elif not request.user.is_staff:
            reports = Report.objects.all().filter(patient_id__account_id=pk)
        else:
            reports = Report.objects.none()
        if not reports:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def filter_reports(self, request):
        query = Report.objects.all()

        doctor_first_name_q_param = request.query_params.get('doctor_first_name')
        doctor_last_name_q_param = request.query_params.get('doctor_last_name')
        patient_first_name_q_param = request.query_params.get('patient_first_name')
        patient_last_name_q_param = request.query_params.get('patient_last_name')
        gross_exam_q_param = request.query_params.get('gross_exam')
        microscopic_exam_q_param = request.query_params.get('microscopic_exam')
        immuno_examination_q_param = request.query_params.get('immuno_examination')
        special_stain_exam_q_param = request.query_params.get('special_stain_exam')
        diagnosis_q_param = request.query_params.get('diagnosis')
        medical_codes_q_param = request.query_params.get('medical_codes')
        topography_codes_q_param = request.query_params.get('topography_codes')

        if doctor_first_name_q_param:
            query = query.filter(
                doctor__first_name__iexact=doctor_first_name_q_param)
        if doctor_last_name_q_param:
            query = query.filter(
                doctor__last_name__iexact=doctor_last_name_q_param)
        if patient_first_name_q_param:
            query = query.filter(
                patient_id__account_id__first_name__iexact=patient_first_name_q_param)
        if patient_last_name_q_param:
            query = query.filter(
                patient_id__account_id__last_name__iexact=patient_last_name_q_param)
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
