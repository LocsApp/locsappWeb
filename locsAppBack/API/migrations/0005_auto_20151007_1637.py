# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0004_auto_20151007_1635'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='is_admin',
            field=models.CharField(max_length=10, default='False'),
        ),
    ]
