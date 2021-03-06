# Generated by Django 2.2.2 on 2019-06-17 19:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dictionary', '0002_auto_20190604_1413'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='text',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterUniqueTogether(
            name='text',
            unique_together={('user', 'text')},
        ),
    ]
