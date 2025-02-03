from flask import current_app as app , jsonify, request , render_template, send_file
from flask_security import auth_required , roles_required , current_user
from .models import db , User, Service , ServiceRequest
from datetime import date
from .datastore import datastore
import flask_excel as excel
from werkzeug.security import check_password_hash
from flask_restful import marshal , fields
from .tasks import download_service_request_resource
from celery.result import AsyncResult

fields= {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}

@app.route('/')
def home():
    return render_template("index.html")


@app.route('/admin')
@auth_required("token")
@roles_required('admin')
def admin():
    return 'Welcome to the admin dashboard'



@app.route('/activate_user/<int:user_id>')
@auth_required("token")
@roles_required('admin')
def activate_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    user.active = True
    db.session.commit()
    return jsonify({'message': 'User activated successfully'}), 200


@app.route("/user-login" , methods=["POST"])
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if check_password_hash(user.password, data.get('password')):
        role = user.roles[0].name
        id = user.id
        print(user.id)
        return jsonify({"token": user.get_auth_token(), "role":role, "id":id}), 200
    else:
        return jsonify({'message': 'Wrong Password'}), 401
    


@app.route("/users" , methods=["GET"])
@auth_required("token")
@roles_required('admin')
def all_users():
    users = User.query.all()
    if len(users)==0:
        return jsonify({'message': 'No users found'}), 404
    return marshal(users, fields), 200

@app.route("/get-services", methods=["GET"])
def get_services():
    services = Service.query.all()
    if len(services)==0:
        return jsonify({'message': 'No services found'}), 404
    response = []
    for service in services:
        response.append({"id": service.id, "name": service.name, "description": service.description, "price": service.price,"time_required": service.time_required})
    return jsonify(response), 200


@app.route("/create-serviceRequest", methods=["POST"])
def create_service_request():
    try:
        data = request.get_json()
        service_id = data.get('service_id')
        user_id = data.get('user_id')
        service_request = ServiceRequest(service_id=service_id, customer_id=user_id, professional_id=-1, date_of_request=date.today(), date_of_completion=date.today(), service_status="requested", remarks="")
        db.session.add(service_request)
        db.session.commit()
        return jsonify({'message': 'Service request created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Some error occured'}), 400
    

@app.route("/get-serviceHistory", methods=["POST"])
def get_service_history():
    data = request.get_json()
    user_id = data.get('user_id')
    service_requests = ServiceRequest.query.filter_by(customer_id=user_id).all()
    print(service_requests)
    if len(service_requests)==0:
        return jsonify({'service_requests':[]})
    response = []
    for service_request in service_requests:
        service = Service.query.get(service_request.service_id)
        if service_request.professional_id == -1:
            professional_name = "NA"
            exp_in_years = "NA"
        else:
            professional = User.query.get(service_request.professional_id)
            professional_name = professional.username
            exp_in_years = professional.exp_in_years 
        
        
        response.append({"id" : service_request.id, "service_name": service.name,"professional_name":professional_name, "exp_in_years":exp_in_years , "service_status":service_request.service_status})
    return jsonify(response), 200


@app.route("/get-serviceRequests", methods=["POST"])
def get_service_requests():
    prof_id = request.get_json().get('prof_id')
    prof = User.query.get(prof_id)
    service_requests = ServiceRequest.query.all()
    if len(service_requests)==0:
        return jsonify({"service_requests":[] })
    response = []
    for service_request in service_requests:
        service = Service.query.get(service_request.service_id)
        if service.name == prof.service_name and service_request.service_status == "requested":
            customer = User.query.get(service_request.customer_id)
            response.append({"id" : service_request.id, "service_name": service.name,"customer_name":customer.email, "price":service.price })
    return jsonify(response), 200


@app.route("/accept-serviceRequest", methods=["POST"])
def accept_service_request():
    data = request.get_json()
    service_request_id = data.get('service_request_id')
    professional = User.query.get(data.get('prof_id'))
    print(service_request_id)
    service_request = ServiceRequest.query.get(service_request_id)
    service_request.service_status = "accepted"
    service_request.professional_id = data.get('prof_id')
    

    db.session.commit()
    return jsonify({'message': 'Service request accepted successfully'}), 200
    

@app.route("/close-serviceRequest", methods=["POST"])
def close_service_request():
    data = request.get_json()
    service_request_id = data.get('service_request_id')
    service_request = ServiceRequest.query.get(service_request_id)
    service_request.service_status = "closed"
    db.session.commit()
    return jsonify({'message': 'Service request closed successfully'}), 200

@app.route("/completed-serviceRequests", methods=["POST"])
def get_all_ac_service_requests():
    prof_id = request.get_json().get('prof_id')
    service_requests = ServiceRequest.query.filter_by(professional_id=prof_id).all()

    if len(service_requests)==0:
        return jsonify({"service_requests":[] })
    response = []
    for service_request in service_requests:
        service = Service.query.get(service_request.service_id)
        if service_request.service_status == "accepted" or service_request.service_status == "completed":
            customer = User.query.get(service_request.customer_id)
            response.append({"id" : service_request.id, "service_name": service.name,"customer_name":customer.email, "price":service.price , "status":service_request.service_status , "remarks": service_request.remarks})
    return jsonify(response), 200
    

@app.route("/close-serviceRequest-remarks", methods=["POST"])
@auth_required("token")
def close_service_request_get_remarks():
    data = request.get_json()
    service_request_id = data.get('service_request_id')
    remarks = data.get('remarks')
    
    service_request = ServiceRequest.query.get(service_request_id)
    if not service_request:
        return jsonify({'message': 'Service request not found'}), 404
    
    service_request.remarks = remarks
    service_request.service_status = "completed"
    db.session.commit()
    
    return jsonify({'message': 'Service request closed successfully'}), 200


@app.route("/delete-serviceRequest/<int:service_id>", methods=["GET"])
@auth_required("token")
def delete_service_request(service_id):
    service_request = ServiceRequest.query.get(service_id)
    if not service_request:
        return jsonify({'message': 'Service request not found'}), 404
    
    db.session.delete(service_request)
    db.session.commit()
    
    return jsonify({'message': 'Service request deleted successfully'}), 200


@auth_required("token")
@roles_required('admin')
@app.route("/download-service-requests")
def download_services():
    task = download_service_request_resource.delay()
    return jsonify({'task_id': task.id}), 200

@auth_required("token")
@roles_required('admin')
@app.route("/download-service-requests-status/<task_id>")
def download_services_status(task_id):
    task = AsyncResult(task_id)
    if task.ready():
        filename =  task.result
        return send_file(filename, as_attachment=True),200
    else:
        return jsonify({"status":"still working on it "})  , 404
    