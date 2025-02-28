from smtplib import SMTP

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_SERVER = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'admin@localhost.com'
SENDER_PASSWORD = ""


def send_email(to  , subject , content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL

    msg.attach(MIMEText(content_body , 'html'))
    client  = SMTP(host = SMTP_SERVER , port = SMTP_PORT)
    client.send_message(msg)
    client.quit()


