
var articulosCarrito = new Array();

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

//Función para manejar cuando se selecciona el artículo
var insertarArticuloClicked;

var btnInsertar = document.getElementById('btn-insertar');
var carritoBody = document.getElementById('carrito-body');
btnInsertar.disabled = true;


function articuloSeleccionado(articulo) {

	let id = document.getElementById('id');
	let referencia = document.getElementById('referencia');
	let precio = document.getElementById('precio');
	
	/**
	 * Elimino el evento click para que cuando obtener el artículo correcto
	 * al seleccionarlo
	 */
	btnInsertar.removeEventListener('click', insertarArticuloClicked, false);

	id.value = articulo.id;
	referencia.value = articulo.referencia;
	precio.value = articulo.precio;
	cantidad.disabled = false;
	cantidad.focus();

	//función para manejar cuando se pulsa un artículo
	insertarArticuloClicked = function() {

		insertarArticuloCarrito(articulo);
	}

	btnInsertar.addEventListener('click', insertarArticuloClicked); 
}

/**
 * función para insertar artículos
 * @param {El artículo a insertar} articulo 
 */
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

/**
 * Función que llena el carrito con los artículos
 */
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

/**
 * Función que calcula el total del carrito
 * segun los articulos que contiene
 */
function calcularTotalCarrito() {

	let cantidadTotal = 0;
	articulosCarrito.forEach(articuloCarrito => {

		cantidadTotal +=
			(articuloCarrito.articulo.precio * articuloCarrito.cantidad);
	});

	return cantidadTotal;
	
}

/**
 * función que borra la fila de la tabla y del array
 * @param {fila que borrar} row 
 * @param {artículo que borramos} articulo 
 */
function borrarArticuloFila(row, articulo) {

	if (confirm('¿Desea eliminar el artículo del carrito?' +
				'\nEsta operación es definitiva')) {
		
		row.remove();
		articulosCarrito.splice(articulosCarrito.indexOf(articulo), 1);
		rellenarCarrito();
	}
}

/**
 * Función para cancelar la venta
 */
function cancelarVenta() {

	if (confirm('¿Cancelar Venta?')) {
		articulosCarrito = new Array();
		window.location.href = '../index.html';
	}
}

/**
 * Función que guarda la venta
 */
function saveVenta() {

	let ventasStorage = JSON.parse(localStorage.getItem('ventas'));
	if (confirm('¿Desea guardar la venta?')) {
		
		//checkeo la cookie
		if (cookieExists('venta', 'activa')) {
			

			let venta 
			let id;
			let buttonGuardarVenta = document.getElementById('finalizar-venta');

			if (buttonGuardarVenta.textContent == 'ACTUALIZAR VENTA') {

				ventasFromStorage.splice(ventasFromStorage.indexOf(ventaCargada), 1);
				ventaCargada.articulos = articulosCarrito;
				ventaCargada.totalVenta = calcularTotalCarrito();
				ventasFromStorage.push(ventaCargada);

				console.log(ventaCargada);
			}
			else {
				if (ventasFromStorage !== null && ventasFromStorage.length > 0) {
	
					id = ventasFromStorage[ventasFromStorage.length -1].id + 1;
				}
				else {
					id = 1;
				}
				venta = new Venta(id, clienteVenta, articulosCarrito, calcularTotalCarrito());
				if (ventasFromStorage !== null && ventasFromStorage.length > 0) {
					ventasFromStorage.push(venta);
				}
				else {
					ventasFromStorage = new Array();
					ventasFromStorage.push(venta);
				}
			}
			localStorage.removeItem('ventas');
			localStorage.setItem('ventas', JSON.stringify(ventasFromStorage));
			articulosCarrito = new Array();
			rellenarCarrito();
			deleteCookie('venta');
			alert('Venta registrada con éxito!!');
		}
		else {
			alert('He excedido el tiempo de realizar la venta..')
		}
		//vuelvo a ventas
		window.location.href = './ventas.html';
	}
}

/**
 * Funcion que borra la venta seleccionada
 */
function borrarVenta() {

	if (confirm('¿Desea borrar la venta?')) {

		if (ventasFromStorage !== null && ventasFromStorage.length <= 1) {
			localStorage.removeItem('ventas');
		}
		else {
			ventasFromStorage.splice(ventasFromStorage.indexOf(ventaCargada), 1);
			localStorage.removeItem('ventas');
			if (ventasFromStorage.length > 0) {
				localStorage.setItem('ventas', JSON.stringify(ventasFromStorage));
			}
		}

		cargarVentas();
	}
}

/**
 * Función que determina si un valor es un número
 * En caso que no, muestra un mensaje de error
 * @param {pasamos un valor} cantidad 
 */
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

/**
 * Función encargada de cargar los clientes y los pinta
 * si no hay muestra mensaje informando
 */
function cargarClientes() {

	ventasFromStorage = JSON.parse(localStorage.getItem('ventas'));
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

	if (clientes != null && clientes.length > 0) {

		let a = document.createElement('a');
		a.appendChild(document.createTextNode('  o Volver a ventas'));
		a.href = './ventas.html';
		titulo.textContent = 'Seleccione un cliente:   ';
		titulo.appendChild(a);
		clientes.forEach(cliente => {

			let col = document.createElement('div');
			let card = document.createElement('div');
			let body = document.createElement('div');
			let title = document.createElement('h5');
			let p = document.createElement('p');
			let p1 = document.createElement('p');
			let textoTitulo = document.createTextNode('ID: ' + cliente.id);
			let textoBody = document.createTextNode('NOMBRE: ' + cliente.nombre);
			let textoBody1 = document.createTextNode('DNI: ' + cliente.dni);
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

		clientes = null;
		titulo.textContent = 'No hay clientes registrados...';
		titulo.style.color = 'red';
		let enlace = document.createElement('a');
		enlace.href = '../index.html';
		enlace.textContent = '  <-Volver a Home';
		titulo.appendChild(enlace);
	}
}

/**
 * Carga los artículos en el carrito
 * @param {cliente al que vendemos} cliente 
 */
function cargarArticulos(cliente) {

	/**
	 * Al entrar este método emieza la venta, pongo la cookie que
	 * expirará en 30m.Para las pruebas la pongo a 1, solo hay que 
	 * cambiar el valor numérico al que se desee.
	 */
	initCookie('venta', 'activa', 30);

	/**
	 * Inicio el contador para avisar cuando faltan
	 * 5 minutos para poder finalizar la venta
	 */
	initAlertExpiresSession();

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

	if (articulos == null || articulos.length == 0) {

		titulo.textContent = 'No hay artículos en el almacen...';
		titulo.style.color = 'red';
		titulo.appendChild(document.createElement('br'));
		let p = document.createElement('p');

		let buttonHome = document.createElement('button');
		buttonHome.textContent = "VOLVER A HOME";
		buttonHome.className = 'btn btn-primary mt-3';
		buttonHome.addEventListener('click', function() {
			window.location.href = '../index.html';
		});

		let buttonArticulos = document.createElement('button');
		buttonArticulos.textContent = 'AÑADIR ARTÍCULOS';
		buttonArticulos.className = 'btn btn-primary mt-3 ml-3';
		buttonArticulos.addEventListener('click', function() {
			window.location.href = '../pages/articulos.html';
		});

		p.appendChild(buttonHome);
		p.appendChild(buttonArticulos);
		titulo.appendChild(p);
	}
	else {
		titulo.textContent = 'Seleccione articulos para añadir';
	}
	
	carrito.style.display = 'inline';
	articulos.forEach(articulo => {
	
		let col = document.createElement('div');
		let card = document.createElement('div');
		let body = document.createElement('div');
		let title = document.createElement('h5');
		let p = document.createElement('p');
		let p1 = document.createElement('p');
		let textoTitulo = document.createTextNode('ID: ' + articulo.id);
		let textoBody = document.createTextNode('REF: ' + articulo.referencia);
		let textoBody1 = document.createTextNode('PRECIO: ' + articulo.precio  + '€');
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

/**
 * Carga las ventas almacenadas, en caso de no haber
 * muestra mensaje informativo
 */
function cargarVentas() {

	ventasFromStorage = JSON.parse(localStorage.getItem('ventas'));

	let jumbotron = document.getElementById('jumbo-ventas');
	let padre = document.getElementById('cards-container');
	let titulo = document.getElementById('titulo');
	let carrito = document.getElementById('carrito');
	let div = document.createElement('div');
	let row = document.createElement('div');
	let btnCancelar = document.getElementById('cancelar-venta');
	
	jumbotron.style.display = 'none';
	carrito.style.display = 'none';
	//btnCancelar.style.display = 'none';
	div.className = 'contenedor-clientes';
	row.className = 'row';
	//Vacio el contenido del contenedor padre de las cards
	padre.innerHTML = '';

	if (ventasFromStorage !== null && ventasFromStorage.length > 0) {

		let a = document.createElement('a');
		a.appendChild(document.createTextNode('  o Volver a ventas'));
		a.href = './ventas.html';
		titulo.textContent = 'Seleccione una venta:   ';
		titulo.appendChild(a);

		ventasFromStorage.forEach(venta => {

			let col = document.createElement('div');
			let card = document.createElement('div');
			let body = document.createElement('div');
			let title = document.createElement('h5');
			let p = document.createElement('p');
			let p1 = document.createElement('p');
			let textoTitulo = document.createTextNode('ID: ' + venta.id);
			let textoBody = document.createTextNode('CLIENTE: ' + venta.cliente.nombre);
			let textoBody1 = document.createTextNode('TOTAL: ' + venta.totalVenta.toFixed(2) + ' €');
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
				console.log('entra listener de venta pulsada');
				articulosCarrito = venta.articulos;
				ventaCargada = venta;
				cargarArticulos(venta.cliente);
				rellenarCarrito();
				let buttonGuardarVenta = document.getElementById('finalizar-venta');
				buttonGuardarVenta.textContent = 'ACTUALIZAR VENTA';
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
		ventas = null;
		titulo.textContent = 'No hay ventas registradas...';
		titulo.className = 'animate__animated animate__fadeInUp mt-5'
		titulo.style.color = 'red';
		let enlace = document.createElement('a');
		enlace.href = './ventas.html';
		enlace.textContent = '  <-Volver a Ventas';
		titulo.appendChild(enlace);
	}
}

/**
 * Inicia una cookie
 * @param {nombre de la cookie} name 
 * @param {valor de la cookie} value 
 * @param {tiempo duración en minutos} maxAge 
 */
function initCookie(name, value, maxAge) {

	document.cookie = name + "=" + value + ";max-age=" + maxAge * 60;

}

/**
 * Borra la cookie con el nombre que le pasemos
 * @param {nombre cookie} name 
 */
function deleteCookie(name) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
 * Determina si existe una cookie con nombre y valor pasado
 * @param {nomnbre de la cookie} name 
 * @param {valor de la cookie} value 
 */
function cookieExists(name, value) {

	//let cookie = document.cookie.trim().split(';');
	//console.log(document.cookie.indexOf('venta'));
	//let index = cookie.indexOf(name + '=' + value);

	if (document.cookie.indexOf('venta') === -1) {
		return false;
	}
	else {
		return true;
	}
}

/**
 * Inicia una alerta para avisar que han pasado 25m.
 */
function initAlertExpiresSession() {

	setTimeout(function() {
		alert('¡¡Tiene 5 minutos para finalizar la venta!!');
	}, 25 * 60 * 1000);
}