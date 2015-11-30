# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0009_auto_20151123_1448'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='last_activity_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='account',
            name='registered_date',
            field=models.DateField(auto_now_add=True, default=datetime.datetime(2015, 11, 30, 16, 15, 24, 235637, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
