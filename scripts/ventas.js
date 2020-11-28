
var articulosCarrito = new Array();

// utilizo para crear clientes y articulos
/*
//cargo los clientes
var cliente = new Cliente(1, 'Pepe', 'Rodrigez Prieto', '543456567y', '15/03/23', 'jc@g.com', 'manoto');
var cliente1 = new Cliente(2, 'Manolo', 'Fonambulo Martinez', '53215465t', '15/03/23', 'jc@g.com', 'manoto');
var cliente2 = new Cliente(3, 'Martina', 'Ramos Moll', '54673456V', '15/03/23', 'jc@g.com', 'manoto');
var cliente3 = new Cliente(4, 'Maria', 'Manolo Fenandez', '34567656U', '15/03/23', 'jc@g.com', 'manoto');
var clientes = [
	cliente, cliente1, cliente2, cliente3,
];

//cargo los artículos
var articulos = [
	new Articulo(1,'tostadora', 'la mejor', 'hogar', 50.23),
	new Articulo(2, 'portatil', 'el mejor', 'patatin', 568),
	new Articulo(3, 'disco duro', 'de gena', 'info', 245),
	new Articulo(4, 'fp2', 'la mejor', 'mascarilla', 2.5)
];

localStorage.setItem('clientes', JSON.stringify(clientes));
localStorage.setItem('articulos', JSON.stringify(articulos)); */

//cargo los clientes
var clientes = JSON.parse(localStorage.getItem('clientes'));

//cargo los artículos
var articulos = JSON.parse(localStorage.getItem('articulos'));

//cliente al que vendemos
var clienteVenta;

//Aquí almacenaré las ventas del localstorage cuando sea necesario
var ventasFromStorage;

//venta que cargaré para manipularla
var ventaCargada;

var insertarArticuloClicked;
var btnInsertar = document.getElementById('btn-insertar');
var carritoBody = document.getElementById('carrito-body');
btnInsertar.disabled = true;


function articuloSeleccionado(articulo) {

	let id = document.getElementById('id');
	let referencia = document.getElementById('referencia');
	let precio = document.getElementById('precio');
	
	btnInsertar.removeEventListener('click', insertarArticuloClicked, false);
	id.value = articulo.id;
	referencia.value = articulo.referencia;
	precio.value = articulo.precio;
	cantidad.disabled = false;
	cantidad.focus();

	insertarArticuloClicked = function() {

		insertarArticuloCarrito(articulo);
	}

	btnInsertar.addEventListener('click', insertarArticuloClicked); 
}

function insertarArticuloCarrito(articulo) {

	let cantidad = document.getElementById('cantidad');
	
	//Compruebo si ya esta insertado ese artículo
	let existeArticulo = false;
	articulosCarrito.forEach(articuloCarrito => {

		if (articuloCarrito.articulo.id == articulo.id) {		
			articuloCarrito.cantidad = (parseInt(cantidad.value) + articuloCarrito.cantidad);
			existeArticulo = true;
		}
	});

	if (!existeArticulo) {
		let articuloCarrito = new ArticuloCarrito(articulo, parseInt(cantidad.value));
		articulosCarrito.push(articuloCarrito);
	}

	btnInsertar.disabled = true;
	cantidad.disabled = true;
	rellenarCarrito();
}

function rellenarCarrito() {

	//borro el contenido actual del carrito  y pinto el nuevo
	carritoBody.innerHTML = '';
	
	let btnFinalizar = document.getElementById('finalizar-venta');

	if (articulosCarrito.length == 0) {
		btnFinalizar.disabled = true;
	}
	else {
		btnFinalizar.disabled = false;
	}

	articulosCarrito.forEach(articulo => {

		btnInsertar = document.getElementById('btn-insertar');
		let row = document.createElement('tr');
		row.className = 'hijos-form';

		for(let propiedad in articulo.articulo) {
			
			let text = document.createTextNode(articulo.articulo[propiedad]);
			let td = document.createElement('td');
			td.appendChild(text);
			row.appendChild(td);
		}
	
		let tdCantidad = document.createElement('td');
		let textCantidad = document.createTextNode(articulo.cantidad);
		tdCantidad.appendChild(textCantidad);
		row.appendChild(tdCantidad);

		//Calculo la cantidad total de producto
		let tdCantidadTotal = document.createElement('td');
		let textCantidadTotal = 
			document.createTextNode(articulo.cantidad * 
									articulo.articulo.precio);
													
		tdCantidadTotal.appendChild(textCantidadTotal);
		carritoBody.appendChild(row);
		row.appendChild(tdCantidadTotal);

		//Añado el boton de borrar
		let botonBorrar = document.createElement('button');
		botonBorrar.textContent = 'borrar';
		botonBorrar.style.backgroundColor = 'black';
		botonBorrar.style.color = 'white';
		botonBorrar.addEventListener('click', function() {
			borrarArticuloFila(row, articulo);
		})
		row.appendChild(botonBorrar);
	});
	//Introduzco el total del carrito
	let formulario = document.getElementById('forma');
	let cantidadTotalCarrito = document.getElementById('total-carrito');
	cantidadTotalCarrito.textContent = calcularTotalCarrito().toFixed(2);
	formulario.reset();
}

function calcularTotalCarrito() {

	let cantidadTotal = 0;
	articulosCarrito.forEach(articuloCarrito => {

		cantidadTotal +=
			(articuloCarrito.articulo.precio * articuloCarrito.cantidad);
	});

	return cantidadTotal;
	
}

function borrarArticuloFila(row, articulo) {

	if (confirm('¿Desea eliminar el artículo del carrito?' +
				'\nEsta operación es definitiva')) {
		
		row.remove();
		articulosCarrito.splice(articulosCarrito.indexOf(articulo), 1);
		rellenarCarrito();
	}
	else {
		console.log('pulsado no');
	}
}

function cancelarVenta() {

	if (confirm('¿Cancelar Venta?')) {
		articulosCarrito = new Array();
		window.location.href = '../index.html';
	}
}

function saveVenta() {

	if (confirm('¿Desea guardar la venta?')) {
		let ventas;//objeto ventas que contendrá array de ventas
		let ventasStorage = JSON.parse(localStorage.getItem('ventas'));
		let venta 
		let ventaArray = new Array();
		let id;
		if (ventasStorage != null) {

			id = ventasStorage.ventas[ventasStorage.ventas.length -1].id + 1;
			venta = new Venta(id, clienteVenta, articulosCarrito, calcularTotalCarrito());
			ventasStorage.ventas.push(venta);
			localStorage.removeItem('ventas');
			localStorage.setItem('ventas', JSON.stringify(ventasStorage));
		}
		else {

			id = 1;
			venta = new Venta(id, clienteVenta, articulosCarrito, calcularTotalCarrito());
			ventaArray.push(venta);
			ventas = new Ventas(ventaArray);
			localStorage.setItem('ventas', JSON.stringify(ventas));
		}
		articulosCarrito = new Array();
		rellenarCarrito();
		alert('Venta registrada con éxito!!');
		window.location.href = '../index.html';
	}
}

function borrarVenta() {

	if (confirm('¿Desea borrar la venta?')) {
		ventasFromStorage.ventas.splice(ventasFromStorage.ventas.indexOf(ventaCargada), 1);
		localStorage.removeItem('ventas');
		if (ventasFromStorage.ventas.length > 0) {
			localStorage.setItem('ventas', JSON.stringify(ventasFromStorage));
		}
		window.location.href = '../index.html';
	}
}

function cantidadIsNumber(cantidad) {

	let lbCantidad = document.getElementById('lb-cantidad');

	if (cantidad.length > 0) {
		lbCantidad.textContent = '';
		btnInsertar.disabled = false;
		return true;
	}
	else {
		lbCantidad.textContent = 'Solo se aceptan números';
		btnInsertar.disabled = true;
		return false;
	}
	
}


function cargarClientes() {

	let btnBorrar = document.getElementById('borrar-venta');
	let jumbotron = document.getElementById('jumbo-ventas');
	let padre = document.getElementById('cards-container');
	let titulo = document.getElementById('titulo');
	let carrito = document.getElementById('carrito');
	let div = document.createElement('div');
	let row = document.createElement('div');

	btnBorrar.style.display = 'none';
	jumbotron.style.display = 'none';
	carrito.style.display = 'none';
	div.className = 'contenedor-clientes';
	row.className = 'row';
	//Vacio el contenido del contenedor padre de las cards
	padre.innerHTML = '';

	if (clientes != null) {

		titulo.textContent = 'Seleccione un cliente:';
		clientes.forEach(cliente => {

			let col = document.createElement('div');
			let card = document.createElement('div');
			let body = document.createElement('div');
			let title = document.createElement('h5');
			let p = document.createElement('p');
			let p1 = document.createElement('p');
			let textoTitulo = document.createTextNode(cliente.apellido);
			let textoBody = document.createTextNode(cliente.nombre);
			let textoBody1 = document.createTextNode(cliente.dni);
			let button = document.createElement('a');
	
	
			col.className = 'row ml-5 mt-3 animate__animated animate__zoomInDown';
			card.className = 'card';
			body.className = 'card-body';
			title.className = 'card-title';
			p.className = 'card-text';
			p1.className = 'card-text';
			button.className = 'btn btn-primary';
			button.text = 'SELECCIONAR';
			button.addEventListener('click', function() {
				cargarArticulos(cliente);
			}); 
	
			title.appendChild(textoTitulo);
			p.appendChild(textoBody);
			p1.appendChild(textoBody1);
			body.appendChild(title);
			body.appendChild(p);
			body.appendChild(p1);
			body.appendChild(button);
			card.appendChild(body);
			col.appendChild(card);
			row.appendChild(col);
			div.appendChild(row);
			padre.appendChild(div);
		});
	}
	else {
		titulo.textContent = 'No hay clientes registrados...';
		let enlace = document.createElement('a');
		enlace.href = '../index.html';
		enlace.textContent = '  <-Volver a Home';
		titulo.appendChild(enlace);
	}
}

function cargarArticulos(cliente) {

	//asigno el cliente al que vendemos
	clienteVenta = cliente;

	let formulario = document.getElementById('forma');
	formulario.reset();

	let padre = document.getElementById('cards-container');
	let titulo = document.getElementById('titulo');
	padre.innerHTML = '';

	let carrito = document.getElementById('carrito');
	let div = document.createElement('div');
	let row = document.createElement('div');
	div.className = 'contenedor-clientes';
	row.className = 'row';

	let nomCliente = document.getElementById('nombre-cliente');
	let apellidoCliente = document.getElementById('apellido-cliente');
	let dniCliente = document.getElementById('dni-cliente');
	nomCliente.textContent = cliente.nombre;
	apellidoCliente.textContent = cliente.apellido;
	dniCliente.textContent = cliente.dni;

	if (articulos != null) {
		titulo.textContent = 'Seleccione articulos para añadir';
		carrito.style.display = 'inline';
		articulos.forEach(articulo => {
	
			let col = document.createElement('div');
			let card = document.createElement('div');
			let body = document.createElement('div');
			let title = document.createElement('h5');
			let p = document.createElement('p');
			let p1 = document.createElement('p');
			let textoTitulo = document.createTextNode(articulo.referencia);
			let textoBody = document.createTextNode(articulo.descripcion);
			let textoBody1 = document.createTextNode(articulo.precio  + '€');
			let button = document.createElement('button');
	
	
			col.className = 'row ml-5 mt-3 animate__animated animate__zoomIn';
			card.className = 'card';
			body.className = 'card-body';
			title.className = 'card-title';
			p.className = 'card-text';
			p1.className = 'card-text';
			button.className = 'btn btn-primary';
			button.textContent = 'SELECCIONAR';
			button.addEventListener('click', function() {
				articuloSeleccionado(articulo);
			});
	
			title.appendChild(textoTitulo);
			p.appendChild(textoBody);
			p1.appendChild(textoBody1);
			body.appendChild(title);
			body.appendChild(p);
			body.appendChild(p1);
			body.appendChild(button);
			card.appendChild(body);
			col.appendChild(card);
			row.appendChild(col);
			div.appendChild(row);
			padre.appendChild(div);
			
		}); 
	}
	else {
		titulo.textContent = 'No hay artículos en el almacen...';
		let enlace = document.createElement('a');
		enlace.href = '../index.html';
		enlace.textContent = '  <-Volver a Home';
		titulo.appendChild(enlace);
	}
}

function cargarVentas() {

	ventasFromStorage = JSON.parse(localStorage.getItem('ventas'));

	let jumbotron = document.getElementById('jumbo-ventas');
	let padre = document.getElementById('cards-container');
	let titulo = document.getElementById('titulo');
	let carrito = document.getElementById('carrito');
	let div = document.createElement('div');
	let row = document.createElement('div');
	let btnCanelar = document.getElementById('cancelar-venta');
	
	jumbotron.style.display = 'none';
	carrito.style.display = 'none';
	btnCanelar.style.display = 'none';
	div.className = 'contenedor-clientes';
	row.className = 'row';
	//Vacio el contenido del contenedor padre de las cards
	padre.innerHTML = '';

	if (ventasFromStorage != null) {

		titulo.textContent = 'Seleccione una venta:';
		ventasFromStorage.ventas.forEach(venta => {

			let col = document.createElement('div');
			let card = document.createElement('div');
			let body = document.createElement('div');
			let title = document.createElement('h5');
			let p = document.createElement('p');
			let p1 = document.createElement('p');
			let textoTitulo = document.createTextNode(venta.id);
			let textoBody = document.createTextNode(venta.cliente.apellido);
			let textoBody1 = document.createTextNode(venta.totalVenta);
			let button = document.createElement('a');
	
	
			col.className = 'row ml-5 mt-3 animate__animated animate__zoomInDown';
			card.className = 'card';
			body.className = 'card-body';
			title.className = 'card-title';
			p.className = 'card-text';
			p1.className = 'card-text';
			button.className = 'btn btn-primary';
			button.text = 'SELECCIONAR';

			button.addEventListener('click', function() {
				articulosCarrito = venta.articulos;
				console.log(ventasFromStorage);
				ventaCargada = venta;
				cargarArticulos(venta.cliente);
				rellenarCarrito()
			}); 
	
			title.appendChild(textoTitulo);
			p.appendChild(textoBody);
			p1.appendChild(textoBody1);
			body.appendChild(title);
			body.appendChild(p);
			body.appendChild(p1);
			body.appendChild(button);
			card.appendChild(body);
			col.appendChild(card);
			row.appendChild(col);
			div.appendChild(row);
			padre.appendChild(div);
		});
	}
	else {
		titulo.textContent = 'No hay ventas registradas...';
		let enlace = document.createElement('a');
		enlace.href = '../index.html';
		enlace.textContent = '  <-Volver a Home';
		titulo.appendChild(enlace);
	}
}