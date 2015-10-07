# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0003_account_logo_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='is_active',
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name='account',
            name='is_admin',
            field=models.CharField(max_length=10),
        ),
    ]
