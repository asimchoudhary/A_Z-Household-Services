from flask import Flask
from application.models import db , User , Role
from application.resources import api
from application.datastore import datastore
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import monthly_user_report , daily_prof_notification
from application.caching import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    api.init_app(app)   
    excel.init_excel(app)
    db.init_app(app)

    app.security  = Security(app , datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views    
    
    return app 

app  = create_app()
celery_app = celery_init_app(app)
@celery_app.on_after_configure.connect
def send_email(sender , **kwargs):
    sender.add_periodic_task(crontab(hour=20 , minute=44 , day_of_month=1), 
                             monthly_user_report.s()) 
    
    sender.add_periodic_task(crontab(hour=20 , minute=44     ), 
                             daily_prof_notification.s())

if __name__ == '__main__':
    app.run(debug=True)