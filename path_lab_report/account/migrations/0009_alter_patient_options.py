# Generated by Django 4.0.5 on 2022-06-18 09:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_alter_patient_options_alter_account_managers_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='patient',
            options={'permissions': [('add_report', 'Can add report')], 'verbose_name': 'Patient'},
        ),
    ]