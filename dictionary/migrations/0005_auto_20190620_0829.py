# Generated by Django 2.2.2 on 2019-06-20 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0004_auto_20190618_1652'),
    ]

    operations = [
        migrations.RenameField(
            model_name='text',
            old_name='date',
            new_name='repeat_last',
        ),
        migrations.AddField(
            model_name='text',
            name='repeat_level',
            field=models.IntegerField(default=0),
        ),
    ]
