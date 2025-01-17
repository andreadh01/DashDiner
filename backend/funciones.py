import smtplib,ssl
from email.message import EmailMessage
from azure.storage.blob import BlobServiceClient,generate_blob_sas,BlobSasPermissions, ContentSettings
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()
account_name =os.environ.get('AZURE_PORTAL_ACC')
account_key = os.environ.get('AZURE_KEY')
container = os.environ.get('AZURE_CONTAINER')
connect_str = 'DefaultEndpointsProtocol=https;AccountName=' + account_name + ';AccountKey=' + account_key + ';EndpointSuffix=core.windows.net'

def subir_imagen(file, file_name:str):
    import base64
    binary_data = base64.b64decode(file['blob'])
    my_content_settings = ContentSettings(content_type=file['type'])
    service = BlobServiceClient.from_connection_string(connect_str)
    blob_client = service.get_container_client(container=container)
    blob_client.upload_blob(name=file_name,data=binary_data,content_settings=my_content_settings,overwrite=True)

def get_url_imagen(blob_name):


    sas_blob = generate_blob_sas(account_name=account_name, 
                                container_name=container,
                                blob_name=blob_name,
                                account_key=account_key,
                                permission=BlobSasPermissions(read=True),
                                expiry=datetime.utcnow() + timedelta(days=5))
    print('SASSS BLOBL',sas_blob)
    print('https://'+account_name+'.blob.core.windows.net/'+container+'/'+blob_name+'?'+sas_blob)
    url = 'https://'+account_name+'.blob.core.windows.net/'+container+'/'+blob_name+'?'+sas_blob
    return url
def mandar_correo_codigo(sender, receiver, password, codigo, tipo):
    if tipo=='password':
        email_subject = 'Código de Cambio de Contraseña'
    elif tipo =='signup':
        email_subject = 'Verifica tu correo'
    sender_email_address = sender
    receiver_email_address = receiver
    email_smtp = "smtp.gmail.com"
    email_password = password

    # Create an email message object
    message = EmailMessage()

    # Configure email headers
    message['Subject'] = email_subject
    message['From'] = sender_email_address
    message['To'] = receiver_email_address

    # Set email body text
    if tipo=='password': # cambiar contraseña
        message.set_content(f"Su código para cambiar su contraseña es {codigo}")
    elif tipo=='signup': # confirmar correo
        message.set_content(f"Su código para confirmar su correo es {codigo}")
    context = ssl.create_default_context()
    # Set smtp server and port
    with smtplib.SMTP(email_smtp, 587, context=context) as smtp:
        # Login to email account
        smtp.login(sender_email_address, email_password)

        # Send email
        smtp.sendmail(sender_email_address, receiver_email_address, message.as_string())

def mandar_correo_de_password(sender, receiver, password_cuenta_email, password_cuenta_cliente ):
    email_subject = 'Bienvenido a DashDiner'
    sender_email_address = sender
    receiver_email_address = receiver
    email_smtp = "smtp.gmail.com"
    email_password = password_cuenta_email

    # Create an email message object
    message = EmailMessage()

    # Configure email headers
    message['Subject'] = email_subject
    message['From'] = sender_email_address
    message['To'] = receiver_email_address

    # Set email body text
    mensaje = "Gracias por confiar en nostros.\nLa contraseña de su cuenta es: "+password_cuenta_cliente+" .\nInicie sesiion y cambie su contraseña para asegurar la seguridad de su cuenta.\n"

    message.set_content(mensaje)

    context = ssl.create_default_context()
    # Set smtp server and port
    with smtplib.SMTP(email_smtp, 587, context=context) as smtp:
        # Login to email account
        smtp.login(sender_email_address, email_password)

        # Send email
        smtp.sendmail(sender_email_address, receiver_email_address, message.as_string())

        # Close connection to server
        

def enviar_correo(from_email, to_email, password, code):
    try:
        # Configura el servidor SMTP de Gmail
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587

        # Crea un objeto MIMEMultipart para el mensaje
        message = EmailMessage()
        message['From'] = from_email
        message['To'] = to_email
        message['Subject'] = 'Codigo de verificacion'

        # Agrega el contenido del correo (puedes usar HTML si lo prefieres)
        mensaje = "Gracias por confiar en nostros.\nLa contraseña de su cuenta es: "+str(code)+" .\nInicie sesiion y cambie su contraseña para asegurar la seguridad de su cuenta.\n "
        message.set_content(mensaje)
        
        # Inicia una conexión SMTP con el servidor y envía el correo
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=120)
        server.starttls()
        server.login(from_email, password)
        text = message.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        print('Correo enviado correctamente')
    except Exception as e:
        print(f'Error al enviar el correo: {str(e)}')

# if __name__ == '__main__':
#     from_email = 'dashdiner115@gmail.com'
#     to_email = 'davidnunez635@gmail.com'
#     password = 'Tostitosconqueso'  # Contraseña de la cuenta de Gmail
#     subject = 'Asunto del correo'
#     message_body = 'Este es el contenido del correo.'
#      # Lista de archivos a adjuntar (opcional)

#     enviar_correo(from_email, to_email, 'dtel eiej hyjo pkud', 1234)