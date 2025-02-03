from flask_restful import Resource , Api, reqparse, marshal_with , fields, marshal
from application.models import Service , db, User , ServiceRequest
from .datastore import datastore
from flask_security import auth_required , roles_required , current_user
from werkzeug.security import generate_password_hash
from flask_restful import fields
from flask import request
from datetime import date
from .caching import cache

# ? there is also an _or operator in sqlalchemy which can be used to filter the data from the database on different conditions 

parser = reqparse.RequestParser()

parser.add_argument("name", type=str, required=True, help="Name is required")
parser.add_argument("price", type=float, required=True, help="Price is required")
parser.add_argument("time_required", type=str, required=True, help="Time required is required")
parser.add_argument("description", type=str, required=True, help="Description is required")

# parser to parse userResourc e

user_parser = reqparse.RequestParser()
user_parser.add_argument("email", type=str, required=True, help="Email is required")
user_parser.add_argument("password", type=str, required=True, help="Password is required")
user_parser.add_argument("username", type=str, required=True, help="Username is required")
user_parser.add_argument("pincode", type=str, required=True, help="Pincode is required")
user_parser.add_argument("address", type=str, required=True, help="Address is required")
user_parser.add_argument("role", type=str, required=True)
user_parser.add_argument("exp_in_years", type=str)
user_parser.add_argument("service_name", type=str)



api = Api(prefix="/api")

# TODO Do all the crud operations here 
# ? You can also use current_user from flask_security to get information about the current user and its details via current_user._get_current_object 

class RoleName(fields.Raw):
    def format(self, value):
        return value[0].name

service_fields = {
    "id": fields.Integer,
    'name': fields.String,
    'price': fields.Float,
    'time_required': fields.String,
    'description': fields.String
}
user_fields = {
    "id": fields.Integer,
    'email': fields.String,
    "password": fields.String,
    'username': fields.String,
    'pincode': fields.String,
    'address': fields.String,
    "exp_in_years": fields.String,
    "service_name": fields.String,
    "active": fields.Boolean,
    "roles": RoleName
}

# ? You can also define your custom feilds to format the objects such User , Service etc. which are non json serizable objects



class UserResource(Resource):
    @marshal_with(user_fields)
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        users = User.query.all()
        return users
        
    
    def post(self):

        args = user_parser.parse_args()
        # User registration
        if datastore.find_user(email=args['email']):
            return {'message': "User already exists"}, 400
        if args["role"]=="cust":
            datastore.create_user(username=args['username'], email=args['email'], password=generate_password_hash(args['password']), roles=['cust'], pincode=args['pincode'], address=args['address'])
            db.session.commit()
            user = datastore.find_user(email=args['email'])
            return {"message": "User added successfully"}, 201
        else:
            datastore.create_user(username=args['username'], email=args['email'], password=generate_password_hash(args['password']), roles=['prof'], pincode=args['pincode'], address=args['address'], exp_in_years=args['exp_in_years'], service_name=args['service_name'], active=False)
            db.session.commit()
            user = datastore.find_user(email=args['email'])
            return {"message": "User added successfully"}, 201
    
    @auth_required("token")
    @roles_required("admin")
    def put(self, id,role):
        if role=="cust":
            user = User.query.get(id)
            user.active = not user.active
            db.session.commit()
            return {'message': 'User active status changed'}, 200
        else:
            user = User.query.get(id)
            user.active = not user.active
            db.session.commit()
            return {'message': 'User active status changed'}, 200
        
    @auth_required("token")
    @roles_required("admin")
    def delete(self, id,role):
        print(id)
        try:
            user = User.query.get(id)
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted successfully'}, 200
        except Exception as e:
            print(e)
            return {"message": "Some error occured"}, 404 

    
    
class ServiceResource(Resource):
    # convert python objects into json objects
    @marshal_with(service_fields)
    @auth_required("token")
    @cache.cached(timeout=10)
    def get(self, id=None):
        if id is None:
            services = Service.query.all()
            if not services:
                return {'message': 'No services found'}, 404
            print(services)
            return services
        else:
            service = Service.query.get(id)
            return service
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        args = parser.parse_args()
        service = Service(name=args['name'], price=args['price'], time_required=args['time_required'], description=args['description'])
        db.session.add(service)
        db.session.commit()       
        return {'message': 'Service added successfully'}, 201
    

    
    @auth_required("token")
    @roles_required("admin")
    def put(self , id):
        try:
            args = parser.parse_args()
            service = Service.query.get(id)
            service.name = args['name']
            service.price = args['price']
            service.time_required = args['time_required']
            service.description = args['description']
            db.session.commit()
            return {'message': 'Service updated successfully'}, 200
        except:
            return {'message': 'Service Not updated'}, 404
    
    @auth_required("token")
    @roles_required("admin")
    def delete(self , id):
        service = Service.query.get(id)
        db.session.delete(service)
        db.session.commit()
        return {'message': 'Service deleted successfully'}, 200
    



    

api.add_resource(UserResource, '/userResource', '/userResource/<int:id>/<string:role>')
api.add_resource(ServiceResource, '/serviceResource' , '/serviceResource/<int:id>')
