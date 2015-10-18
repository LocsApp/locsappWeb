# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0006_auto_20151017_1759'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='is_admin',
        ),
        migrations.AddField(
            model_name='account',
            name='role',
            field=models.CharField(default='user', max_length=10),
        ),
    ]
