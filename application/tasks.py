from celery import shared_task
from application.models import ServiceRequest , User , Service
import flask_excel as excel
from flask import render_template
from .mail_service import send_email

@shared_task(ignore_result=False)
def download_service_request_resource():
    service_requests = ServiceRequest.query.filter_by(service_status="completed").with_entities(ServiceRequest.id,ServiceRequest.customer_id, ServiceRequest.professional_id ,ServiceRequest.remarks).all()
    csv = excel.make_response_from_query_sets(service_requests, column_names=["id","customer_id","professional_id","remarks"], file_type='csv')
    filename = "./csv_files/service_requests.csv"

    with open(filename, 'wb') as f:
        f.write(csv.data) 

    return filename 

@shared_task()
def monthly_user_report():
    users = User.query.filter(User.roles.any(name='cust')).all()
    for user in users:
        email = user.email
        total_requests = ServiceRequest.query.filter_by(customer_id=user.id).count()
        requested_requests = ServiceRequest.query.filter_by(customer_id=user.id, service_status="requested").count()
        completed_requests = ServiceRequest.query.filter_by(customer_id=user.id, service_status="completed").count()
        categories = ServiceRequest.query.filter_by(customer_id=user.id).join(Service).with_entities(Service.name).distinct().all()
        remarks = ServiceRequest.query.filter_by(customer_id=user.id).with_entities(ServiceRequest.remarks).all()

        remarks_list = [remarks[0] for remarks in remarks if remarks[0] != ""]
        categories_list = [category[0] for category in categories]

        html_report = render_template('monthly_report.html', 
                                       total_requests=total_requests,
                                       total_requests_pending=requested_requests,
                                       total_requests_completed=completed_requests,
                                       categories=categories_list,
                                       remarks=remarks_list)
        
        send_email(email,"Monthly Activity Report",html_report)



    return "Sent"

@shared_task()
def daily_prof_notification():
    professionals = User.query.filter(User.roles.any(name="prof")).all()
    for professional in professionals:
        service_name = professional.service_name
        service_requests = ServiceRequest.query.join(Service).filter(
                ServiceRequest.service_status == "requested",
                Service.name == service_name,
                ServiceRequest.professional_id == -1
            ).all()
        if service_requests:
            details_service_requests = [
                {"service_request_id": service_request.id}
                for service_request in service_requests

            ]
            html_report = render_template('daily_report_prof.html', service_requests=details_service_requests)
            send_email(professional.email, "Daily Service Request", html_report)
        
    return "Sent"        
