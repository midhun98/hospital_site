# Generated by Django 4.2.3 on 2023-09-22 10:54

import django_ckeditor_5.fields
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("patients", "0010_alter_scanimage_image_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="scanreport",
            name="findings",
            field=django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name="Text"),
        ),
    ]
