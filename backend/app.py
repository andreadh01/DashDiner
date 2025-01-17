import json
from random import randint
from time import strptime
from flask import Flask, jsonify, redirect, request, session
from flask_cors import CORS
from sqlalchemy import and_, distinct, extract, func
from database import Administrador, Cocina, EstadoOrden, Items_orden, Opcion, Opciones_orden, Orden, Producto, Productos_favoritos, Restaurante, Restaurantes_favoritos, Seleccion_disponible, Usuario, Categoria, TipoUsuario
from database import db
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
import stripe
from funciones import *
import os
from dateutil import relativedelta

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')
stripe.api_key = os.environ.get('STRIPE_SECRET')
"""
cuando esten en desarrollo cambiar la ruta de la base de datos a la que se tiene en su computadora
"""
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:''@localhost/dashdiner'

load_dotenv()
app = Flask(__name__)
app.secret_key = 'tostitosconquesotostitosconyogurt'
CORS(app)
user= os.getenv('DATABASE_USERNAME')
print(user)
password= os.getenv('DATABASE_PASSWORD')
host= os.getenv('DATABASE_HOST')
print(host)
database= os.getenv('DATABASE')
# app.config['SQLALCHEMY_DATABASE_URI'] =( f'mysql+pymysql://{user}:{password}@{host}:3306/{database}?'
#     f'ssl_ca=./server_ca.pem&')
app.config['SQLALCHEMY_DATABASE_URI'] =f'mysql+pymysql://{user}:{password}@{host}:3306/{database}'
@app.route('/')
def home():
    return jsonify('hola mundo')

@app.route('/login', methods=['POST'])
def login():
    """
    Este método sirve para checar si el usuario que se quiere
    logear exista en la base de datos
    """
    data = request.get_json()
    correo = data.get('correo')
    password = data.get('password')
    usuario_existente = Usuario.query.filter_by(correo=correo).first()
    print('Correo Electrónico:', correo)
    print('Contraseña:', password)
    if usuario_existente:
        if password==usuario_existente.password:#sha256_crypt.verify(usuario_existente.password, password):  
            session.clear()
            session['usuario_id'] = usuario_existente.id
            session['correo'] = usuario_existente.correo
            session['nombre'] = usuario_existente.nombre
            session['apellido'] = usuario_existente.apellido
            session['tipo'] = usuario_existente.tipo.value
            session['nombre_usuario'] = usuario_existente.nombre_usuario
            session['celular'] = usuario_existente.celular
            session['logeado']= True 
            suscrito = False
            admin = Administrador.query.filter_by(id_usuario=usuario_existente.id).first();
            if admin:
                if admin.suscripcion_id is not None:
                    subscription = stripe.Subscription.retrieve(
  admin.suscripcion_id,
)
                    if subscription.status == 'active':
                        suscrito = True
            return jsonify({'id':session['usuario_id'], 'tipo':session['tipo'], 'nombre':session['nombre'], 'apellido':session['apellido'], 'nombre_usuario':session['nombre_usuario'],'correo':session['correo'],'logeado': True,'suscrito':suscrito})
        else:
            return jsonify({'logeado': False, 'mensaje': 'La contraseña es incorrecta'})
    else:
        return jsonify({'mensaje': 'No existe un usuario registrado con ese correo', 'logeado': False})
    
@app.route('/existingEmail', methods=['POST'])
def existingEmail():
    print("Entra al metodo existingEmail")
    if request.method == 'POST':
        print("Entra al metodo POST")
        correo = request.get_json().get('correo')
        usuario_existente = Usuario.query.filter_by(correo=correo).first()
        print("Ejecutó la consulta")
        if usuario_existente:
            return jsonify({'existe': True})
        else:
            return jsonify({'existe': False})
    else:
        return jsonify({'existe': False})

@app.route('/registro', methods=['POST'])
def registrar_usuario():
    print("Entra al metodo registroAdmin")
    if request.method == 'POST':
        data = request.get_json()['usuario']
        usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo=data['correo'],
        password=data['password'],
        celular=data['celular'],
        nombre=data['nombre'],
        apellido=data['apellido'],
        tipo=data['tipo']
        )
        db.session.add(usuario)
        db.session.commit()

        return jsonify({'mensaje':'El usuario se registro correctamente','registrado':True}),200
    else:
        print("Entra al metodo else de usuario")
        return jsonify({'mensaje':'El usuario no se registro correctamente',}),400


@app.route('/registroRestaurante', methods=['POST'])
def registrar_restaurante():
    
    if request.method == 'POST':
        print("Entra al metodo registroAdmin")
        data = request.get_json()['usuario']
        
        rest = request.get_json()['restaurante']
        print(rest.keys())
        subir_imagen(rest['logo'],rest['nombre']+'_logo.png')
        url = get_url_imagen(rest['nombre']+'_logo.png')
        usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo=data['correo'],
        password=data['password'],
        celular=data['celular'],
        nombre=data['nombre'],
        apellido=data['apellido'],
        tipo=data['tipo']
        )
        
        
        
        # datos de prueba 
        # clabe
        # 000000001234567897 - transferencias exitosas
        # 000000111111111117 - transferencia falla
        # para pruebas consultar https://stripe.com/docs/connect/testing#testing-top-ups
        bank = stripe.Token.create(
  bank_account={
    "country": "MX",
    "currency": "mxn",
    "account_holder_name": data['nombre']+" "+data['apellido'],
    "account_holder_type": "individual",
    "account_number": data['clabe'],
  },
)
        stripe_acc = stripe.Account.create(
          country="MX",
          type="custom",
          business_type="individual",
          external_account=bank, 
          individual={"id_number": '000000000',"dob": {
              "day": 1,
              "month": 1,
              "year": 1901,
            },"first_name":data['nombre'],"phone":data['celular'],"last_name":data['apellido'],"email":data['correo'],
                      "address": {
              "city": 'Hermosillo',
              "line1": 'address_full_match',
              "state": 'Sonora',
              "country": 'MX',
              "postal_code": '83209',
            },},
          capabilities={"card_payments": {"requested": True}, "transfers": {"requested": True}},
          business_profile= {
              "url":"https://dashdiner.azurewebsites.net/",
              "mcc":"5814",
          },
          tos_acceptance={"date": 1547923073, "ip": "172.18.80.19"}, # datos de testing
        )
        db.session.add(usuario)
        db.session.commit()
        admin = Administrador(id_usuario=usuario.id,stripe_id=stripe_acc.id,clabe="000000001234567897")
        db.session.add(admin)
        restaurante = Restaurante(id_usuario=usuario.id,nombre=rest['nombre'],logo=url,direccion=rest['direccion'],horario=rest['horario'],celular=rest['celular'],descripcion=rest['descripcion'])
        db.session.add(restaurante)
        db.session.commit()
        return jsonify({'mensaje':'El restaurante se registro correctamente','registrado':True}),200
    else:
        print("Entra al metodo else de registroAdmin")
        return jsonify({'mensaje':'El restaurante no se registro correctamente',}),400


@app.route('/transferir', methods=['POST'])
def transferir():
    admin_id = json.loads(request.data)['id_administrador']
    admin = Administrador.query.filter_by(id_usuario=admin_id).first()
    restaurante = Restaurante.query.filter_by(id_usuario=admin_id).first()
    ordenes = Orden.query.filter_by(id_restaurante=restaurante.id,pagado=False).all()
    amount = calcularTransferencia(ordenes)
    
    print(stripe.Balance.retrieve())
    payout = stripe.Transfer.create(
  amount=amount,
  currency="mxn",
  destination=admin.stripe_id,
)
    if payout is not None:
        for orden in ordenes:
            orden.pagado = True
        db.session.commit()
        return jsonify({'contenido':'La transferencia ha sido exitosa','tipo':'success'})
    else:
        return jsonify({'contenido':'Ha ocurrido un error al realizar la transferencia','tipo':'error'})

@app.route('/get_admin_id/<int:cocina_id>', methods=['GET'])
def get_admin_id(cocina_id):
    vinculo = Cocina.query.filter_by(id_usuario=cocina_id).first()
    restaurante = Restaurante.query.filter_by(id=vinculo.id_restaurante).first()
    
    return jsonify({'id':restaurante.id_usuario})


@app.route('/monto_pagar/<int:admin_id>', methods=['GET'])
def monto_pagar(admin_id):
    admin = Administrador.query.filter_by(id_usuario=admin_id).first()
    restaurante = Restaurante.query.filter_by(id_usuario=admin_id).first()
    ordenes = Orden.query.filter_by(id_restaurante=restaurante.id,pagado=False).all()
    amount = calcularTransferencia(ordenes)/100
    return jsonify({'cantidad':amount, 'clabe':admin.clabe})
def calcularTransferencia(ordenes):
    costo = 0
    for orden in ordenes:
        costo += orden.precio_total
    # en stripe los amounts se dan en centavos
    return int(costo*100)
@app.route('/create-subscription', methods=['POST'])
def create_subscription():
    data = json.loads(request.data)
    customer = data['customer']
    admin_id = customer['id']
    admin = Administrador.query.filter_by(id_usuario=admin_id).first()
    #https://stripe.com/docs/billing/subscriptions/build-subscriptions?ui=elements&locale=es-419
    
    
    if admin.customer_id is None:
        stripe_customer = stripe.Customer.create(
      email=customer['correo'],
      name=customer['nombre'],
      shipping={
        "address": {
          "city": "Brothers",
          "country": "US",
          "line1": "27 Fredrick Ave",
          "postal_code": "97712",
          "state": "CA",
        },
        "name": customer['nombre'],
      },
      address={
        "city": "Brothers",
        "country": "US",
        "line1": "27 Fredrick Ave",
        "postal_code": "97712",
        "state": "CA",
      },
    )
        admin.customer_id = stripe_customer.id
    stripe_customer = admin.customer_id
    try:
        # Create the subscription. Note we're expanding the Subscription's
        # latest invoice and that invoice's payment_intent
        # so we can pass it to the front end to confirm the payment
        subscription = stripe.Subscription.create(
            customer=stripe_customer,
            items=[{
                'price': 'price_1O7LvWGH50PI9nsFNjbDvQmA',
            }],
            payment_behavior='default_incomplete',
            payment_settings={'payment_method_types':['card'],'save_default_payment_method': 'on_subscription'},
            expand=['latest_invoice.payment_intent'],
        )
        admin.suscripcion_id = subscription.id
        db.session.commit()
        return jsonify(subscriptionId=subscription.id, clientSecret=subscription.latest_invoice.payment_intent.client_secret)

    except Exception as e:
        print(e)
        return jsonify(error={'message': e.user_message}), 400
    
@app.route('/cancel-subscription', methods=['POST'])
def cancelSubscription():
    data = json.loads(request.data)
    admin_id = data['id_administrador']
    admin = Administrador.query.filter_by(id_usuario=admin_id).first()
    try:
         # Cancel the subscription by deleting it
        deletedSubscription = stripe.Subscription.delete(admin.suscripcion_id)
        admin.suscripcion_id = None;
        db.session.commit()
        print(deletedSubscription)
        return jsonify({
          'contenido': 'La suscripción ha sido cancelada',
          'tipo': 'success',
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
@app.route("/forgot-password", methods=['POST'])
def forgot_password():
    """Controla restablecer contraseña.
    Se asegura que no haya una sesion iniciada.
    Se confirma que el usuario exista y se envia un codigo de recuperación.
    Se redirige a reset_code"""
    data = request.get_json()
    correo = data.get('correo')
    print('Correo Electrónico:', correo)
    usuario_existente = Usuario.query.filter_by(correo=correo).first()
    if usuario_existente:
        correo = usuario_existente.correo
        codigo = ''
        for i in range(4):
            numero = randint(0, 9)
            codigo += str(numero)
        session['codigo'] = codigo
        print('Codigo:', codigo)
        # MANDAR CODIGO POR CORREO DE LA PERSONA
        enviar_correo('dashdiner115@gmail.com', usuario_existente.correo, 'dtel eiej hyjo pkud', codigo)
        return jsonify({'correo': usuario_existente.correo, 'codigo': codigo, 'codigoboolean': True})
    else:
        return jsonify({'mensaje': 'Correo no registrado con este correo', 'codigoboolean': False})

@app.route("/new_password", methods=['POST'])
def guardar_password():
    data=request.get_json()
    correo=data.get('correo')
    new_password = data.get('new_password')
    print('Correo Electrónico:', correo)
    print('Contraseña:', new_password)
    usuario_existente = Usuario.query.filter_by(correo=correo).first()
    if usuario_existente:
        print('Usuario encontrado')
        usuario_existente.password = new_password

        # Confirmar la actualización en la base de datos
        db.session.commit()
        return jsonify({'mensaje':'La opción se actualizo correctamente'})
    else:
        return jsonify({'mensaje':'El usuario no existe'})

@app.route('/producto', methods = ['POST', 'PUT'])
def guardar_producto():
    if request.method == 'POST':
        data = request.get_json()
        filename = str(data['id_restaurante'])+'_'+data['nombre']+'_producto.png'
        subir_imagen(data['imagen'],filename)
        url = get_url_imagen(filename)
        producto = Producto(
    id_restaurante=data['id_restaurante'],
    id_categoria=data['id_categoria'],
    descripcion=data['descripcion'],
    nombre=data['nombre'],
    precio=data['precio'],
    imagen=url,
    estado=data['estado'],
    promocion=data['promocion']
)
        db.session.add(producto)
        db.session.commit()

        return jsonify({'mensaje':'El producto se ha guardado correctamente','id':producto.id}),200
    elif request.method == 'PUT':
        data = request.get_json()
        producto = Producto.query.filter_by(id=data['id']).first()
        producto.id_restaurante = data['id_restaurante']
        producto.id_categoria = data['id_categoria']
        producto.descripcion = data['descripcion']
        producto.nombre = data['nombre']
        producto.precio = data['precio']
        producto.imagen = data['imagen']
        producto.estado = data['estado']
        producto.promocion = data['promocion']
        # Commit the session again to save the Seleccion_disponible objects
        db.session.commit()
        # 
        return jsonify({'mensaje':'El producto se actualizo correctamente'}),200


@app.route('/producto_favorito', methods = ['POST', 'DELETE'])
def producto_favorito():
    if request.method == 'DELETE':
        data = request.get_json()
        print(data)
        prod_favorito = Productos_favoritos.query.filter_by(id_producto=data['id_producto'],
    id_usuario=data['id_usuario']).first()
        db.session.delete(prod_favorito)
        db.session.commit()
        return jsonify({'mensaje':'El producto se eliminó de favoritos correctamente'}),200
    if request.method == 'POST':
        data = request.get_json()
        prod_favorito = Productos_favoritos(
        id_producto=data['id_producto'],
    id_usuario=data['id_usuario'],
            )   
        db.session.add(prod_favorito)
        db.session.commit()

        return jsonify({'mensaje':'El producto se guardó como favoritos correctamente'}),200
@app.route('/restaurante_favorito', methods = ['GET','POST', 'DELETE'])
def restaurante_favorito():
    if request.method == 'DELETE':
        data = request.get_json()
        restaurante = Restaurantes_favoritos.query.filter_by(id_restaurante=data['id_restaurante'], id_usuario=data['id_usuario']).first()
        db.session.delete(restaurante)
        db.session.commit()
        return jsonify({'mensaje':'El restaurante se eliminó de favoritos correctamente'}),200
    if request.method == 'GET':
        data = request.get_json()
        isFavorito = Restaurantes_favoritos.query.filter_by(id_restaurante=data['id_restaurante'],
        id_usuario=data['id_usuario']).first()
        if(isFavorito):
            return jsonify({'favorito':True}),200
        else:
            return jsonify({'favorito':False}),200
    if request.method == 'POST':
        data = request.get_json()
        res_favorito = Restaurantes_favoritos(
        id_restaurante=data['id_restaurante'],
        id_usuario=data['id_usuario'],
            )   
        db.session.add(res_favorito)
        db.session.commit()

        return jsonify({'mensaje':'El restaurante se guardó como favoritos correctamente'}),200
    
@app.route('/restaurante_favorito/<int:id_restaurante>/<int:id_usuario>', methods = ['GET'])
def get_restaurante_favorito(id_restaurante,id_usuario):
        isFavorito = Restaurantes_favoritos.query.filter_by(id_restaurante=id_restaurante,
        id_usuario=id_usuario).first()
        if(isFavorito):
            return jsonify({'favorito':True}),200
        else:
            return jsonify({'favorito':False}),200
@app.route('/categoria', methods = ['POST', 'PUT'])
def guardar_categoria():
    if request.method == 'POST':
        data = request.get_json()
        opcion = Categoria(
    id_restaurante=data['id_restaurante'],
    nombre=data['nombre'],
)
        db.session.add(opcion)
        db.session.commit()

        return jsonify({'mensaje':'La opción se actualizo correctamente'}),200
    elif request.method == 'PUT':
        data = request.get_json()
        cat = Categoria.query.filter_by(id=data['id']).first()
        cat.nombre = data['nombre']
        db.session.commit()
        # 
        return jsonify({'mensaje':'La opción se actualizo correctamente'}),200

@app.route('/usuario/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Usuario.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({'mensaje':'Usuario no encontrado','tipo': 'error'}), 404

    # Get updated data from the request
    data = request.get_json()

    # Update the user properties
    user.nombre_usuario = data.get('nombre_usuario', user.nombre_usuario)
    user.correo = data.get('correo', user.correo)
    user.password = data.get('password', user.password)
    user.celular = data.get('celular', user.celular)
    user.nombre = data.get('nombre', user.nombre)
    user.apellido = data.get('apellido', user.apellido)

    # Commit the changes to the database
    db.session.commit()
    user = Usuario.query.filter_by(id=user_id).first()
    user = convertir_a_dict(user)
    print(user)
    user['tipo'] = user['tipo'].value
    user['logeado'] = True
    print(user)
    return jsonify({'mensaje':'La cuenta se ha actualizado correctamente','tipo': 'success','user':user}), 200

@app.route('/restaurante/<int:restaurant_id>', methods=['PUT'])
def update_restaurante(restaurant_id):
    restaurante = Restaurante.query.filter_by(id=restaurant_id).first()
    if restaurante is None:
        return jsonify({'error': 'Restaurant not found'}), 404

    # Get updated data from the request
    data = request.get_json()
    print(data.get('logo')['url'])
    print(restaurante.logo)
    if (data.get('logo')['url'] != restaurante.logo):
        subir_imagen(data.get('logo'),data.get('nombre', restaurante.nombre)+'_logo.png')
        url = get_url_imagen(data.get('nombre', restaurante.nombre)+'_logo.png')
        restaurante.logo = url
    # Update the restaurant properties
    restaurante.nombre = data.get('nombre', restaurante.nombre)
    restaurante.descripcion = data.get('descripcion', restaurante.descripcion)
    
    restaurante.horario = data.get('horario', restaurante.horario)
    restaurante.celular = data.get('celular', restaurante.celular)
    restaurante.direccion = data.get('direccion', restaurante.direccion)

    # Commit the changes to the database
    db.session.commit()

    return jsonify({'message': 'Restaurant updated successfully'}), 200
@app.route('/ordenes/<int:id>', methods=['GET'])
def get_ordenes(id):
    restaurante = Restaurante.query.filter_by(id_usuario=id).first()
        # Query the database to fetch orders, items, and options
    orders = Orden.query.filter_by(id_restaurante=restaurante.id).all()
    orders_data = []
    for order in orders:
        orden_dic = crear_orden_dict(order)
        orders_data.append(orden_dic)
    return jsonify(orders_data)

@app.route('/ordenes_id/<int:orden_id>/<int:admin_id>', methods=['GET'])
def get_ordenes_by_id_and_admin(orden_id,admin_id):
    restaurante = Restaurante.query.filter_by(id_usuario=admin_id).first()
    # Query the database to fetch orders, items, and options filtered by order ID and admin ID
    print(orden_id)
    print(admin_id)
    orders = Orden.query.filter(and_(Orden.id == orden_id, Orden.id_restaurante == restaurante.id)).all()
    orders_data = []
    for order in orders:
        orden_dic = crear_orden_dict(order)
        orders_data.append(orden_dic)
    print(orders_data)
    return jsonify(orders_data)


@app.route('/ordenes/<string:correo>', methods=['GET'])
def get_ordenes_por_correo(correo):
    # Buscamos todas las órdenes asociadas a ese correo
    print(correo)
    orders = obtenerOrdenesCorreo(correo)

    # Convertimos las órdenes a formato dict para devolver en JSON
    orders_data = [crear_orden_dict(order) for order in orders]
    print(orders_data)
    # Devolvemos las órdenes en formato JSON
    return jsonify(orders_data)

def obtenerOrdenesCorreo(correoCliente):
    orders = Orden.query.filter_by(correo=correoCliente).all()
    print(orders)
    return orders
def crear_orden_dict(order):
    return {
            "id": order.id,
            "correo": order.correo,
            "id_restaurante": order.id_restaurante,
            "fecha": order.fecha.strftime('%Y-%m-%d %H:%M:%S'),  # Format as needed
            "precio_total": order.precio_total,
            "estado": order.estado.value,
            "pagado": order.pagado,
            "items": [
                {
                    "id": item.id,
                    "nombre": Producto.query.filter_by(id=item.id_producto).first().nombre,
                    "cantidad": item.cantidad,
                    "precio_total": item.precio_total,
                    "opciones": [
                        {
                            "id": opcion.id,
                            "nombre": opcion.nombre,
                            "precio": opcion.precio
                        }
                        for opcion in item.opciones
                    ]
                }
                for item in order.items
            ]
        }
@app.route('/actualizar_orden', methods = ['PUT'])
def actualizar_orden():
    if request.method == 'PUT':
        data = request.get_json()
        orden = data['orden']
        orden_bd = Orden.query.filter_by(id=orden['id']).first()
        orden_bd.estado = orden['estado']
        db.session.commit()
        return jsonify({'tipo':'success','contenido':'El estado de la orden se actualizó correctamente'}),200
        

@app.route('/ordenes', methods = ['POST'])
def ordenes():
    if request.method == 'POST':
        data = request.get_json()
        producto_seleccionado_list = data['orden']
        correo = data['correo']
        

        # en caso de que el usuario haya realizado pedidos de diferentes restaurantes,
        # se iran guardando en el diccionario para no crear ordenes dobles
        # el formato del dict de ordenes es {id_rest: orden}
        dict_ordenes = {}
        # Create an Orden instance with appropriate values

        for producto_seleccionado in producto_seleccionado_list:
            cantidad = producto_seleccionado['cantidad']
            producto = producto_seleccionado['producto']
            id_rest = producto['restaurante_id']

            if (id_rest in dict_ordenes):
                orden = dict_ordenes[id_rest]
                orden.precio_total += producto['precio'] * cantidad
            else:
                orden = Orden(
                    correo=correo,
                    id_restaurante=id_rest,
                    precio_total=producto['precio'] * cantidad,
                    pagado=False
                    
                    )
                db.session.add(orden)
                db.session.commit()
                dict_ordenes[id_rest] = orden
            # Map and insert Items_orden
            item_orden = map_producto_seleccionado_to_items_orden(producto, orden.id, cantidad)
            db.session.add(item_orden)
            db.session.commit()

            # Map and insert Opciones_orden
            opciones_orden_list = map_producto_seleccionado_options_to_opciones_orden(item_orden.id, producto['selecciones'])
            db.session.add_all(opciones_orden_list)
        db.session.commit()

        return jsonify({"message": "Orden agregada de manera exitosa"})

def map_producto_seleccionado_to_items_orden(producto, orden_id, cantidad):
    items_orden = Items_orden(
        id_orden=orden_id,
        id_producto=producto['id'],
        cantidad=cantidad,
        precio_total=producto['precio']*cantidad
    )
    return items_orden
def map_producto_seleccionado_options_to_opciones_orden(item_orden_id, opciones):
    opciones_orden = []
    for opcion in opciones:
        opcion_orden = Opciones_orden(
            id_item_orden=item_orden_id,
            nombre=opcion['nombre'],
            precio=opcion['precio']
        )
        opciones_orden.append(opcion_orden)
    return opciones_orden

@app.route('/opcion', methods = ['POST', 'PUT'])
def guardar_opcion():
    if request.method == 'POST':
        data = request.get_json()
        opcion = Opcion(
    id_producto=data['id_producto'],
    titulo=data['titulo'],
    multiple=data['multiple']
)
        db.session.add(opcion)
        db.session.commit()

        for seleccion_data in data['selecciones_disponibles']:
            existing_seleccion = Seleccion_disponible.query.filter_by(id=seleccion_data['id']).first()
    
            if existing_seleccion:
                # Update the existing record if found
                existing_seleccion.precio = seleccion_data['precio']
                existing_seleccion.estado = seleccion_data['estado']
            else:
                seleccion = Seleccion_disponible(
        id_opcion=opcion.id,  # Use the generated 'id' of 'opcion'
        nombre=seleccion_data['nombre'],
        precio=seleccion_data['precio'],
        estado=seleccion_data['estado']
    )
                db.session.add(seleccion)

        # Commit the session again to save the Seleccion_disponible objects
        db.session.commit()
        return jsonify({'mensaje':'La opción se actualizo correctamente'}),200
    elif request.method == 'PUT':
        data = request.get_json()
        opcion = Opcion.query.filter_by(id=data['id']).first()
        opcion.titulo = data['titulo']
        opcion.multiple = data['multiple']

        for seleccion_data in data['selecciones_disponibles']:
            existing_seleccion = Seleccion_disponible.query.filter_by(id=seleccion_data['id']).first()
    
            if existing_seleccion:
                # Update the existing record if found
                existing_seleccion.nombre = seleccion_data['nombre']
                existing_seleccion.precio = seleccion_data['precio']
                existing_seleccion.estado = seleccion_data['estado']
            else:
                seleccion = Seleccion_disponible(
        id_opcion=opcion.id,  # Use the generated 'id' of 'opcion'
        nombre=seleccion_data['nombre'],
        precio=seleccion_data['precio'],
        estado=seleccion_data['estado']
    )
                db.session.add(seleccion)

        # Commit the session again to save the Seleccion_disponible objects
        db.session.commit()
        # 
        return jsonify({'mensaje':'La opción se actualizo correctamente'}),200


@app.route('/eliminar_categoria', methods=['DELETE'])
def delete_categoria():
    try:
        index = request.args.get('index')
        #indexes_list = indexes_to_delete.split(',')

        # Convert the string indexes to integers
        #indexes_to_delete = [int(index) for index in indexes_list]

        # Handle the deletion of items based on the 'indexes_to_delete' array
        # Perform your logic here
        existing = Categoria.query.filter_by(id=index).first()
        db.session.delete(existing)
        db.session.commit()

        response_data = {'message': 'Items deleted successfully'}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/eliminar_opciones', methods=['DELETE'])
def delete_opciones():
    try:
        indexes_to_delete = request.args.get('indexes')
        #indexes_list = indexes_to_delete.split(',')

        # Convert the string indexes to integers
        #indexes_to_delete = [int(index) for index in indexes_list]

        # Handle the deletion of items based on the 'indexes_to_delete' array
        # Perform your logic here
        for index in indexes_to_delete:
            existing_seleccion = Opcion.query.filter_by(id=index).first()
            db.session.delete(existing_seleccion)
        db.session.commit()

        response_data = {'message': 'Items deleted successfully'}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@app.route('/eliminar_selecciones', methods=['DELETE'])
def delete_selecciones():
    try:
        indexes_to_delete = request.args.get('indexes')
        #indexes_list = indexes_to_delete.split(',')

        # Convert the string indexes to integers
        #indexes_to_delete = [int(index) for index in indexes_list]

        # Handle the deletion of items based on the 'indexes_to_delete' array
        # Perform your logic here
        for index in indexes_to_delete:
            existing_seleccion = Seleccion_disponible.query.filter_by(id=index).first()
            db.session.delete(existing_seleccion)
        db.session.commit()

        response_data = {'message': 'Items deleted successfully'}
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# GET all restaurantes
@app.route('/restaurantes', methods=['GET'])
def get_all_restaurant():
    restaurantes = db.session.execute(db.select(Restaurante)).all()
    lista_restaurantes = []
    for r in restaurantes:
        restaurante = convertir_a_dict(r[0])
        lista_restaurantes.append(restaurante)
    return jsonify(lista_restaurantes)   

# GET all restaurantes por id
@app.route('/restaurante/<int:id>', methods=['GET'])
def get_restaurante_by_id(id):
    restaurante = db.get_or_404(Restaurante, id)
    restaurante = convertir_a_dict(restaurante)
    return jsonify(restaurante)   

@app.route('/restaurante_admin/<int:id_administrador>', methods=['GET'])
def get_restaurante_admin(id_administrador):
    restaurante = db.session.execute(db.select(Restaurante).where(Restaurante.id_usuario == id_administrador)).first()
    admin = Administrador.query.filter_by(id_usuario=id_administrador).first()
    restaurante = convertir_a_dict(restaurante[0])
    suscrito = False
    if admin.suscripcion_id is not None:
        subscription = stripe.Subscription.retrieve(
  admin.suscripcion_id,
)
        if subscription.status == 'active':
            suscrito = True
    return jsonify({'restaurante':restaurante, 'suscrito':suscrito})

@app.route('/menu/<int:id_restaurante>', methods=['GET'])
def get_menu(id_restaurante):
    productos = db.session.execute(db.select(Producto).where(Producto.id_restaurante == id_restaurante)).all()
    menu = []
    for p in productos:
        prod = convertir_a_dict(p[0])
        menu.append(prod)
    return jsonify(menu)

@app.route('/promociones/<int:id_restaurante>', methods=['GET'])
def get_promociones(id_restaurante):
    productos = db.session.execute(db.select(Producto).where(Producto.id_restaurante == id_restaurante,Producto.promocion == True)).all()
    menu = []
    for p in productos:
        prod = convertir_a_dict(p[0])
        menu.append(prod)
    return jsonify(menu)

@app.route('/menu/<int:id_restaurante>/<int:id_categoria>', methods=['GET'])
def get_menu_por_cateogria(id_restaurante,id_categoria):
    productos = db.session.execute(db.select(Producto).where(Producto.id_restaurante == id_restaurante,Producto.id_categoria==id_categoria)).all()
    menu = []
    for p in productos:
        prod = convertir_a_dict(p[0])
        menu.append(prod)
    return jsonify(menu)
@app.route('/categorias/<int:id_restaurante>', methods=['GET'])
def get_categorias(id_restaurante):
    categorias = db.session.execute(db.select(Categoria).where(Categoria.id_restaurante == id_restaurante)).all()
    lista_categorias = []
    for c in categorias:
        categoria = convertir_a_dict(c[0])
        lista_categorias.append(categoria)
        
    return jsonify(lista_categorias)

@app.route('/categoria/<int:id>', methods=['GET'])
def get_categoria_by_id(id):
    categoria = db.session.execute(db.select(Categoria).where(Categoria.id == id)).first()
    categoria = convertir_a_dict(categoria[0])
    return jsonify(categoria)   
# GET producto
@app.route('/productos/<int:id_administrador>', methods=['GET'])
def get_all_producto(id_administrador):
    restaurante = db.session.execute(db.select(Restaurante).where(Restaurante.id_usuario == id_administrador)).first()
    restaurante= convertir_a_dict(restaurante[0])
    productos = db.session.execute(db.select(Producto).where(Producto.id_restaurante == restaurante['id'])).all()
    lista_productos = []
    for p in productos:
        producto = convertir_a_dict(p[0])
        lista_productos.append(producto)
        
    return jsonify(lista_productos)

# GET producto by id
@app.route('/producto/<int:id>', methods=['GET'])
def get_producto_by_id(id):
    producto = db.get_or_404(Producto, id)
    producto = convertir_a_dict(producto)
    return jsonify(producto)

@app.route('/mis_productos_favoritos/<int:id_usuario>', methods=['GET'])
def get_prod_favoritos(id_usuario):
    favoritos = db.session.execute(db.select(Productos_favoritos).where(Productos_favoritos.id_usuario == id_usuario)).all()

    lista_favoritos = []
    for f in favoritos:
        print(f[0])
        favorito=convertir_a_dict(f[0])
        print(favorito)
        #se añade el id del producto a la lista de favoritos y en caso de que ya este no se añade
        if favorito['id_producto'] not in lista_favoritos:
            lista_favoritos.append(favorito['id_producto'])
    print(lista_favoritos)
    #ahora se obtienen los productos favoritos
    productos = db.session.execute(db.select(Producto).where(Producto.id.in_(lista_favoritos))).all()
    #envio un json con los productos favoritos y sus datos
    lista_productos = []
    #
    #la estructura que manejaré de diccionario es:
    #diccionario_productos = {
    #                          id_producto:{
    #                                       producto
    #                                       },
    #                          id_pruducto2:{
    #                                      producto2
    #                                     },...
    #                        }
    #
    for p in productos:
        print(p[0])
        prod = convertir_a_dict(p[0])
        print(prod)
        lista_productos.append(prod)
    print(lista_productos)

    return jsonify({'productos':lista_productos, 'id_list':lista_favoritos})#aqui se puede devolver el json o el diccionario que es la misma madre pero en python
#solo que el jsonify te lo maneja como un response a la hora de usarlo estilo rest api

@app.route('/mis_restaurantes_favoritos/<int:id_usuario>', methods=['GET'])
def get_rest_favoritos(id_usuario):
    favoritos = db.session.execute(db.select(Restaurantes_favoritos).where(Restaurantes_favoritos.id_usuario == id_usuario)).all()

    lista_favoritos = []
    for f in favoritos:
        print(f[0])
        favorito=convertir_a_dict(f[0])
        print(favorito)
        #se añade el id del restaurante a la lista de favoritos y en caso de que ya este no se añade
        if favorito['id_restaurante'] not in lista_favoritos:
            lista_favoritos.append(favorito['id_restaurante'])
    print(lista_favoritos)
    #ahora se obtienen los restaurantes favoritos
    restaurantes = db.session.execute(db.select(Restaurante).where(Restaurante.id.in_(lista_favoritos))).all()
    #envio un json con los restaurantes favoritos y sus datos
    lista_restaurantes = []
    #
    #la estructura que manejaré de diccionario es:
    #diccionario_productos = {
    #                          id_producto:{
    #                                       producto
    #                                       },
    #                          id_pruducto2:{
    #                                      producto2
    #                                     },...
    #                        }
    #
    for r in restaurantes:
        print(r[0])
        res = convertir_a_dict(r[0])
        lista_restaurantes.append(res)
    print(lista_restaurantes)

    return jsonify({'restaurantes':lista_restaurantes})#aqui se puede devolver el json o el diccionario que es la misma madre pero en python
#solo que el jsonify te lo maneja como un response a la hora de usarlo estilo rest api

@app.route('/busqueda/<string:busqueda>', methods=['GET'])
def busqueda(busqueda):
    productos = db.session.execute(db.select(Producto).where(Producto.nombre.like("%"+busqueda+"%"))).all()
    restaurantes = db.session.execute(db.select(Restaurante).where(Restaurante.nombre.like("%"+busqueda+"%"))).all()
    resultados = {}
    lista_productos = []
    lista_restaurantes = []
    for p in productos:
        lista_productos.append(convertir_a_dict(p[0]))
    for r in restaurantes:
        lista_restaurantes.append(convertir_a_dict(r[0]))
    resultados['productos'] = lista_productos
    resultados['restaurantes'] = lista_restaurantes
    print(resultados)
    return jsonify(resultados)

@app.route('/opcion/<int:id_opcion>',methods=['GET'])
def get_opcion(id_opcion):
    opcion = db.session.query(Opcion).filter_by(id=id_opcion).options(joinedload(Opcion.selecciones_disponibles)).first()
    opcion_dict = {
            "id": opcion.id,
            "id_producto": opcion.id_producto,
            "titulo": opcion.titulo,
            "multiple": opcion.multiple,
            "selecciones_disponibles": [
                {
                    "id": seleccion.id,
                    "nombre": seleccion.nombre,
                    "precio": seleccion.precio,
                    "estado": seleccion.estado,
                }
                for seleccion in opcion.selecciones_disponibles
            ],
        }
    return jsonify(opcion_dict)

@app.route('/opciones/<int:id_producto>',methods=['GET'])
def get_opciones(id_producto):
    opciones_with_selecciones = db.session.query(Opcion).filter_by(id_producto=id_producto).options(joinedload(Opcion.selecciones_disponibles)).all()
    result = []
    for opcion in opciones_with_selecciones:
        opcion_dict = {
            "id": opcion.id,
            "id_producto": opcion.id_producto,
            "titulo": opcion.titulo,
            "multiple": opcion.multiple,
            "selecciones_disponibles": [
                {
                    "id": seleccion.id,
                    "nombre": seleccion.nombre,
                    "precio": seleccion.precio,
                    "estado": seleccion.estado,
                }
                for seleccion in opcion.selecciones_disponibles
            ],
        }
        result.append(opcion_dict)
    return jsonify(result)

    
@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        ultima_orden = db.session.query(db.func.max(Orden.id)).scalar()
        
        # Si no hay órdenes, empezar con 1
        if not ultima_orden:
            ultima_orden = 0
        data = json.loads(request.data)
        costo = calculate_order_amount(data['items'])
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=costo,
            currency='mxn',
            # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            # automatic_payment_methods={
            #     'enabled': True,
            # },
             payment_method_types= [
        # 'apple_pay',
        # 'google_pay',
        'card',
        # 'oxxo',
        # 'paypal',
            
      ],description=f'Orden de DashDiner {ultima_orden + 1}'
             
        )
        return jsonify({
            'clientSecret': intent['client_secret'], 'costo':costo/100,'paymentIntentId': intent['id']
        })
    except Exception as e:
        print("Error:", e)
        return jsonify(error=str(e)), 403
    

@app.route('/update-payment-intent', methods=['POST'])
def update_payment():
    try:
        data = json.loads(request.data)
        payment_intent_id = data['payment_intent_id']
        correo = data['correo']
 # Obtener el último ID de orden
        ultima_orden = db.session.query(db.func.max(Orden.id)).scalar()
        
        # Si no hay órdenes, empezar con 1
        if not ultima_orden:
            ultima_orden = 0
        # Update the PaymentIntent with the email
        stripe.PaymentIntent.modify(
            payment_intent_id,
            receipt_email=correo,
            description=f'Orden de DashDiner {ultima_orden + 1}'
        )
        print(ultima_orden)
        return jsonify(success=True)
    except Exception as e:
        print("Error:", e)
        return jsonify(error=str(e)), 403


@app.route('/best_sellers/<int:restaurant_id>/<string:filter_type>/<string:date>')
def best_sellers(restaurant_id, filter_type, date):
    # Example date format: '2023-11-28'
    result = []
    start_date = datetime.strptime(date, '%Y-%m-%d')
    end_date = start_date + timedelta(days=1)  # For daily filter
    print(start_date)
    if filter_type == 'month':
        start_date = start_date.replace(day=1)
        print(start_date)
        end_date = start_date + relativedelta.relativedelta(months=1)
    elif filter_type == 'year':
        start_date = start_date.replace(month=1, day=1)
        end_date = start_date + relativedelta.relativedelta(years=1)

    best_sellers_query = db.session.query(Items_orden.id_producto, func.sum(Items_orden.cantidad).label('total_sales')) \
        .join(Orden).filter(
            Orden.id_restaurante == restaurant_id,
            Orden.fecha.between(start_date, end_date)
        ) \
        .group_by(Items_orden.id_producto) \
        .order_by(func.sum(Items_orden.cantidad).desc()) \
        .limit(5)  # You can adjust the limit based on your needs

    best_sellers_data = best_sellers_query.all()

    for item in best_sellers_data:
        item = item._asdict()
        print(item)
        producto = Producto.query.filter_by(id=item['id_producto']).first()
        print(producto)
        producto = convertir_a_dict(producto)
        producto['ventas'] = item['total_sales']
        result.append(producto)



    return jsonify({'data':result})
@app.route('/most_liked/<int:restaurant_id>')
def most_liked(restaurant_id):
    # Query to get most liked products
    result = []
    labels = []
    most_liked_query = db.session.query(Producto.nombre, func.count(Productos_favoritos.id_producto).label('like_count')) \
        .join(Productos_favoritos, Producto.id == Productos_favoritos.id_producto) \
        .filter(Producto.id_restaurante == restaurant_id) \
        .group_by(Producto.id) \
        .order_by(func.count(Productos_favoritos.id_producto).desc()) \
        .limit(5)  # You can adjust the limit based on your needs

    most_liked_data = most_liked_query.all()

    for item in most_liked_data:
        item = item._asdict()
        labels.append(item['nombre'])
        result.append(item['like_count'])

    

    return jsonify({'data':result,'labels':labels})

    # Update the chart data
    #donutChartOptions['labels'] = categories
    #donutChartOptions['series'] = like_count_data

    #return render_template('chart_template.html', chart_options=donutChartOptions)
@app.route('/client_count/<int:restaurant_id>/<string:filter_type>/<string:date>')
def get_client_count(restaurant_id,filter_type,date):
    # Assuming you have an instance of your database as db
    start_date = datetime.strptime(date, '%Y-%m-%d')
    end_date = start_date + timedelta(days=1)  # For daily filter
    print(start_date)
    if filter_type == 'month':
        start_date = start_date.replace(day=1)
        print(start_date)
        end_date = start_date + relativedelta.relativedelta(months=1)
    elif filter_type == 'year':
        start_date = start_date.replace(month=1, day=1)
        end_date = start_date + relativedelta.relativedelta(years=1)
    # Query to get the count of clients for a specific restaurant
    client_count = db.session.query(func.count(func.distinct(Orden.correo))).filter(Orden.id_restaurante==restaurant_id,Orden.fecha.between(start_date, end_date)).scalar()
    
    return jsonify({'client_count': client_count})
# Función para convertir la fecha de la cadena de consulta en un objeto datetime
@app.route('/clients_per_month/<int:restaurant_id>/<int:year>')
def clients_per_month(restaurant_id,year):
    all_months = [0] * 12
    # Get the current date

    # Calculate the date one year ago

    # Query to get the number of clients per month
    results = db.session.query(
        extract('month', Orden.fecha).label('month'),
        func.count(distinct(Orden.correo)).label('num_clients')
    ).filter(
        Orden.id_restaurante == restaurant_id,
        extract('year', Orden.fecha) == year
    ).group_by('month').all()

    for item in results:
        item = item._asdict()
        print(item)
        all_months[item['month']-1] = item['num_clients']
    # Format the results as a list of dictionaries

    return jsonify({'data': all_months})

@app.route('/restaurant_revenue/<int:restaurant_id>/<int:year>')
def get_restaurant_revenue(restaurant_id, year):
    all_months = [0] * 12


    revenue_data = db.session.query(
        extract('month', Orden.fecha).label('month'),
        func.sum(Orden.precio_total).label('monthly_revenue')
    ).filter(
        Orden.id_restaurante == restaurant_id,
        extract('year', Orden.fecha) == year
    ).group_by(extract('month', Orden.fecha)).all()
    
    print('revenue')
    print(revenue_data)
    for item in revenue_data:
        item = item._asdict()
        print(item)
        all_months[item['month']-1] = item['monthly_revenue']

    return jsonify({'revenue_data': all_months})
def parse_fecha_parametro(fecha_parametro):
    try:
        return datetime.strptime(fecha_parametro, '%Y-%m-%d')
    except ValueError:
        return None
    
@app.route('/registro_cocina', methods=['POST'])
def registrar_cocina():
    print("Entra al metodo registroAdmin")
    if request.method == 'POST':
        data = request.get_json()['usuario']
        usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo=data['correo'],
        password=data['password'],
        celular=data['celular'],
        nombre=data['nombre'],
        apellido=data['apellido'],
        tipo='cocina'
        )
        db.session.add(usuario)
        db.session.commit()
        restaurante = Restaurante.query.filter_by(id_usuario=data['id_administrador']).first()
        vincular = Cocina(id_usuario=usuario.id,id_restaurante=restaurante.id)
        db.session.add(vincular)
        db.session.commit()
        return jsonify({'mensaje':'El usuario cocina se ha registro correctamente','registrado':True}),200
    else:
        print("Entra al metodo else de usuario")
        return jsonify({'mensaje':'El usuario cocina no se ha registrado correctamente',}),400

@app.route('/editar_usuario/<int:id>', methods=['POST'])
def editar_usuario(id):
    if request.method == 'POST':
        # Buscar el usuario por su ID
        usuario = Usuario.query.get(id)
        if usuario:
            data = request.get_json()['usuario']

            # Actualizar los campos del usuario
            usuario.nombre_usuario = data.get('nombre_usuario', usuario.nombre_usuario)
            usuario.correo = data.get('correo', usuario.correo)
            usuario.password = data.get('password', usuario.password)
            usuario.celular = data.get('celular', usuario.celular)
            usuario.nombre = data.get('nombre', usuario.nombre)
            usuario.apellido = data.get('apellido', usuario.apellido)
            usuario.tipo = data.get('tipo', usuario.tipo)

            db.session.commit()

            return jsonify({'mensaje': 'El usuario se ha actualizado correctamente', 'actualizado': True}), 200
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'}), 404
    else:
        return jsonify({'mensaje': 'Método no permitido'}), 405
    
def convertir_a_dict(resultado):
    dict_resultado = vars(resultado)
    dict_resultado.pop('_sa_instance_state')
    return dict_resultado

def calculate_order_amount(items):
    cantidad = 0
    for item in items:
        costo = item['producto']['precio']*item['cantidad']
        cantidad += costo
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return cantidad*100

def main():
    db.init_app(app)
    load_dotenv()

    with app.app_context():
        
        db.create_all()
       
        
    app.run(host='0.0.0.0', port=5000, debug=True)


if __name__ == "__main__":
    main()

