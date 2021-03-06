# Generated by Django 2.2.1 on 2019-06-04 14:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='texts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='translation',
            name='original',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='translations', to='dictionary.Text'),
        ),
        migrations.AlterField(
            model_name='translation',
            name='translation',
            field=models.TextField(blank=True),
        ),
    ]
