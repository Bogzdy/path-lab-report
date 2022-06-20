# Generated by Django 4.0.5 on 2022-06-20 10:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gross_exam', models.TextField(null=True, verbose_name='gross examination')),
                ('microscopic_exam', models.TextField(null=True, verbose_name='microscopic examination')),
                ('immuno_examination', models.TextField(null=True, verbose_name='immunohistochemistry examination')),
                ('special_stain_exam', models.TextField(null=True, verbose_name='special stain examination')),
                ('diagnosis', models.TextField(null=True)),
                ('medical_codes', models.TextField(null=True)),
                ('topography_codes', models.TextField(null=True)),
                ('doctor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='doctor_reports', to=settings.AUTH_USER_MODEL, verbose_name='doctor_reports')),
                ('patient', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='patient_reports', to='account.patient', verbose_name='patient_reports')),
            ],
        ),
    ]
