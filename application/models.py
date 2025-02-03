from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = "roles_users"
    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column( db.Integer , db.ForeignKey('user.id'))
    role_id = db.Column( db.Integer, db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), )
    pincode = db.Column(db.String(80), )
    address = db.Column(db.String(255), )
    exp_in_years = db.Column(db.String(80))
    service_name = db.Column(db.String(80))
    active  = db.Column(db.Boolean, default=True)
    fs_uniquifier = db.Column(db.String(80),unique=True ,nullable=False)
    roles = db.relationship('Role', secondary='roles_users' , backref=db.backref('users', lazy='dynamic'))

class Role(db.Model , RoleMixin):
    id  = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    time_required = db.Column(db.String, nullable=False)
    description = db.Column(db.String(255))

class ServiceRequest(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    date_of_request = db.Column(db.DateTime)
    date_of_completion = db.Column(db.DateTime)
    service_status = db.Column(db.String(80))
    remarks = db.Column(db.String(255)) 
    