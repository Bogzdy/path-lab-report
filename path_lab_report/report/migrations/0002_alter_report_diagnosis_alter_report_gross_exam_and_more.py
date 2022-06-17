# Generated by Django 4.0.5 on 2022-06-15 21:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='diagnosis',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='report',
            name='gross_exam',
            field=models.TextField(null=True, verbose_name='gross examination'),
        ),
        migrations.AlterField(
            model_name='report',
            name='immuno_examination',
            field=models.TextField(null=True, verbose_name='immunohistochemistry examination'),
        ),
        migrations.AlterField(
            model_name='report',
            name='medical_codes',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='report',
            name='microscopic_exam',
            field=models.TextField(null=True, verbose_name='microscopic examination'),
        ),
        migrations.AlterField(
            model_name='report',
            name='special_stain_exam',
            field=models.TextField(null=True, verbose_name='special stain examination'),
        ),
        migrations.AlterField(
            model_name='report',
            name='topography_codes',
            field=models.TextField(null=True),
        ),
    ]
