# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_auto_20151007_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='first_name',
            field=models.CharField(default=None, max_length=30),
        ),
        migrations.AddField(
            model_name='account',
            name='last_name',
            field=models.CharField(default=None, max_length=30),
        ),
        migrations.AlterField(
            model_name='account',
            name='birthdate',
            field=models.CharField(max_length=30),
        ),
    ]
