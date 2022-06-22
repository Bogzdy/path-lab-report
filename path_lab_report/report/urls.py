from django.urls import path
from report.views import ReportViewSet

report_url_pattern = [
    path('reports', ReportViewSet.as_view({'get': 'list'})),
    path('reports/<int:pk>', ReportViewSet.as_view({'get': 'retrieve'})),
    path('reports/report', ReportViewSet.as_view({'post': 'create'})),
    path('reports/update/<int:pk>', ReportViewSet.as_view({'patch': 'partial_update'})),
    path('reports/delete/<int:pk>', ReportViewSet.as_view({'delete': 'destroy'})),
    path('reports/filter', ReportViewSet.as_view({'get': 'filter_reports'})),
    path('reports/account-reports', ReportViewSet.as_view({'get': 'get_logged_user_reports'}))
]
