# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0007_auto_20151018_1445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='birthdate',
            field=models.CharField(null=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='account',
            name='first_name',
            field=models.CharField(null=True, max_length=30, default=None),
        ),
        migrations.AlterField(
            model_name='account',
            name='is_active',
            field=models.CharField(null=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='account',
            name='last_name',
            field=models.CharField(null=True, max_length=30, default=None),
        ),
        migrations.AlterField(
            model_name='account',
            name='phone',
            field=models.CharField(null=True, max_length=10),
        ),
    ]
