# Generated by Django 2.2.2 on 2019-06-21 10:34

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0005_auto_20190620_0829'),
    ]

    operations = [
        migrations.AddField(
            model_name='text',
            name='repeat_next',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
