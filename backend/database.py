from dataclasses import dataclass
import datetime
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class TipoUsuario(enum.Enum):
    admin = 'admin'
    cliente = 'cliente'
    cocina = 'cocina'

class EstadoOrden(enum.Enum):
    nuevo = 'nuevo'
    preparando = 'preparando'
    listo = 'listo'
    entregado = 'entregado'
@dataclass
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(100), unique=True, nullable=False)
    correo = db.Column(db.String(100),unique=True, nullable=False)
    password = db.Column(db.String(100),nullable=False)
    celular = db.Column(db.String(100))
    nombre = db.Column(db.String(100),nullable=False)
    apellido = db.Column(db.String(100),nullable=False)
    tipo = db.Column(db.Enum(TipoUsuario),nullable=False)

@dataclass
class Cocina(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    id_restaurante = db.Column(db.Integer, db.ForeignKey('restaurante.id'))
@dataclass
class Administrador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    stripe_id = db.Column(db.String(100),nullable=False)
    customer_id = db.Column(db.String(100),nullable=True)
    suscripcion_id = db.Column(db.String(100),nullable=True)
    clabe = db.Column(db.String(18),nullable=False)
@dataclass
class Restaurante(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id'))
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(100),nullable=False)
    logo = db.Column(db.String(500))
    horario = db.Column(db.String(100),nullable=False)
    celular = db.Column(db.String(100),nullable=False)
    direccion = db.Column(db.String(100),nullable=False)
    

@dataclass
class Categoria(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_restaurante = db.Column(db.Integer, db.ForeignKey('restaurante.id'),nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
@dataclass
class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_restaurante = db.Column(db.Integer, db.ForeignKey('restaurante.id'),nullable=False)
    id_categoria = db.Column(db.Integer,db.ForeignKey('categoria.id'), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(100),nullable=False)
    imagen = db.Column(db.String(500))
    precio = db.Column(db.Double,nullable=False)
    estado = db.Column(db.Boolean,nullable=False)
    promocion = db.Column(db.Boolean,nullable=False)
    opciones = relationship("Opcion", backref="producto")
    
class Opcion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer,db.ForeignKey('producto.id'))
    titulo = db.Column(db.String(100), nullable=False)
    multiple = db.Column(db.Boolean,nullable=False)
    selecciones_disponibles = relationship("Seleccion_disponible", backref="opcion")

class Seleccion_disponible(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_opcion = db.Column(db.Integer,db.ForeignKey('opcion.id'))
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.String(100),nullable=False)
    estado = db.Column(db.Boolean,nullable=False)
    

class Restaurantes_favoritos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_restaurante = db.Column(db.Integer,db.ForeignKey('restaurante.id'))
    id_usuario = db.Column(db.Integer,db.ForeignKey('usuario.id'))

class Productos_favoritos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer,db.ForeignKey('producto.id'))
    id_usuario = db.Column(db.Integer,db.ForeignKey('usuario.id'))

class Orden(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(100))
    id_restaurante = db.Column(db.Integer,db.ForeignKey('restaurante.id'))
    fecha = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    precio_total = db.Column(db.Double,nullable=False)
    estado =db.Column(db.Enum(EstadoOrden),default='nuevo')
    pagado =db.Column(db.Boolean,nullable=False,default='false')
    items = relationship("Items_orden", backref="orden")

class Items_orden(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_orden = db.Column(db.Integer,db.ForeignKey('orden.id'))
    id_producto = db.Column(db.Integer,db.ForeignKey('producto.id'))
    cantidad = db.Column(db.Integer)
    precio_total = db.Column(db.Double,nullable=False)
    opciones = relationship("Opciones_orden", backref="items_orden")
    
class Opciones_orden(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_item_orden = db.Column(db.Integer,db.ForeignKey('items_orden.id'))
    nombre = db.Column(db.String(100))
    precio = db.Column(db.Double,nullable=False)