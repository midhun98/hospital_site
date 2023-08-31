# Generated by Django 4.2.3 on 2023-08-30 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='existence_status',
            field=models.IntegerField(choices=[(0, 'DELETED'), (1, 'ACTIVE'), (2, 'INACTIVE')], default=1),
        ),
        migrations.AddField(
            model_name='invoice',
            name='invoice_name',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]