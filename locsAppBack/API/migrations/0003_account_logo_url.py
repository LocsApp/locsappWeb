# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0002_auto_20151003_1105'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='logo_url',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
