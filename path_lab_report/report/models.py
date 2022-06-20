from django.db import models
from django.contrib.auth.models import AbstractUser
from account.models import Account, Patient


class Report(models.Model):
    doctor = models.ForeignKey(Account,
                               null=True,
                               on_delete=models.SET_NULL,
                               verbose_name='doctor_reports',
                               related_name='doctor_reports')
    patient = models.ForeignKey(Patient,
                                null=True,
                                on_delete=models.SET_NULL,
                                verbose_name='patient_reports',
                                related_name='patient_reports')
    gross_exam = models.TextField('gross examination', null=True)
    microscopic_exam = models.TextField('microscopic examination', null=True)
    immuno_examination = models.TextField('immunohistochemistry examination', null=True)
    special_stain_exam = models.TextField('special stain examination', null=True)
    diagnosis = models.TextField(null=True)
    medical_codes = models.TextField(null=True)
    topography_codes = models.TextField(null=True)
