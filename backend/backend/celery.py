from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
# from backend.base.tasks import update_all_products 



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

CELERY_IMPORTS = ('backend.base.tasks',)

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.enable_utc = False

app.conf.beat_schedule = {
    'run-my-task-every-day-at-2am': {
        'task': 'backend.base.tasks.update_all_products',
        'schedule': crontab(hour=3, minute=4),
    },
}


