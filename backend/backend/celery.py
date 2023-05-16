from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
# backend\base\tasks.py
# from base.tasks import update_all_products




os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# CELERY_IMPORTS = ('backend.base.tasks',)

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


# Celery 
# celery -A backend worker --pool=solo -l info

# Flower
# celery -A backend flower 

# Schedule for celery beat
# celery -A backend beat -l info --scheduler celery.beat.PersistentScheduler
