# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0010_auto_20151130_1615'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='last_activity_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='account',
            name='registered_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
