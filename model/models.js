function Cliente(id, nombre, apellido, dni, 
									fechaNac, email, password) {

	this.id = id;
	this.nombre = nombre;
	this.apellido = apellido;
	this.dni = dni;
	this.fechaNac = fechaNac;
	this.email = email;
	this.password = password;
} 

function Articulo(id, referencia, descripcion, familia, precio) {

	this.id = id;
	this.referencia = referencia;
	this.descripcion = descripcion;
	this.familia = familia;
	this.precio = precio;
}

function ArticuloCarrito(articulo, cantidad) {
	
	this.articulo = articulo;
	this.cantidad = cantidad;
}

function Venta(id ,cliente, articulos) {
	
	this.id = id;
	this.cliente = cliente;
	this.articulos = articulos;
}

function Ventas(ventas) {
	this.ventas = ventas;
}