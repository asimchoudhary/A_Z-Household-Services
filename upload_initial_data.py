from main import app
from application.datastore import datastore
from application.models import db, Role
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    datastore.find_or_create_role(name='admin', description='A person with administrative privileges')
    datastore.find_or_create_role(name='prof', description='A person who provides services')
    datastore.find_or_create_role(name='cust', description='A person who requests services')
    db.session.commit()

    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(username="admin",email="admin@email.com" , password=generate_password_hash("admin"), roles=['admin'])
    
    db.session.commit()
    

