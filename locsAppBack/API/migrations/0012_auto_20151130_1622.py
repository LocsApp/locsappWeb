# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0011_auto_20151130_1618'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='registered_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
