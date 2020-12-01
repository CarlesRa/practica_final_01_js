var clientes = JSON.parse(localStorage.getItem('clientes'));
var clienteSeleccionado; //almacenare el cliente a modificar.
var form = document.getElementById('forma');
var nombre = form.nombre;
var apellido = form.apellido;
var dni = form.dni;
var fechaNac = form.fecha;
var email = form.email;
var password = form.pass;

let buttonSubmit = document.getElementById('submit');

//seteo la fecha máxima del input calendario
setMaxDateInput();

//Compruebo si hay clientes
hayClientes();

/**
 * Función para validar el formulario 
 */
function validarForm() {

    let isOk = true;

    if (!validarNombre(nombre.value)) {
        isOk = false;
    }
    else if (!validarApellido(apellido.value)) {
        isOk = false;
    }
    else if (!validarDni(dni.value)) {
        isOk = false;
    }
    else if (!validarFechaNac(fechaNac.value)) {
        isOk = false;
    }
    else if (!validarEmail(email.value)) {
        isOk = false;
    }
    else if (!validarPassword(password.value)) {
        isOk = false;
    }

    if (isOk){
		saveCliente();
    }
 }

 /**
  * Función que guarda el cliente
  */
function saveCliente() {



	if (confirm('¿Desea guardar el cliente?')) {

		let buttonSubmit = document.getElementById('submit');

		if (buttonSubmit.textContent === "ACTUALIZAR CLIENTE") {
			
			clientes.splice(clientes.indexOf(clienteSeleccionado), 1);
			clienteSeleccionado.nombre = nombre.value;
			clienteSeleccionado.apellido = apellido.value;
			clienteSeleccionado.dni = dni.value;
			clienteSeleccionado.fechaNac = fechaNac.value;
			clienteSeleccionado.email = email.value;
			clienteSeleccionado.password = password.value;
			clientes.push(clienteSeleccionado);
		}
		else {
			let id;
			if (clientes != null && clientes.length > 0) {
	
				id = clientes[clientes.length -1].id + 1;	
			}
			else {
				id = 1;
			}
			let cliente = new Cliente(id, nombre.value, apellido.value, 
									  dni.value, fechaNac.value, email.value, 
									  password.value);
	
			if (clientes != null) {
				clientes.push(cliente);
			}
			else {
				clientes = new Array();
				clientes.push(cliente);
			}
		}

		localStorage.removeItem('clientes');
		localStorage.setItem('clientes', JSON.stringify(clientes));
		buttonSubmit.textContent = "GARDAR NUEVO CLIENTE";
		form.reset();
		cargarClientes();
	}
}

/**
 * Función que elimina un cliente
 * @param {cliente a eliminar} cliente 
 */
function eliminarCliente(cliente) {

	if (confirm('¿Desea borrar el cliente ' + cliente.apellido +'?')) {

		if (clientes.length === 1) {
			console.log('entra 1');
			let cardColumns = document.getElementById('cards-container');
			let jumbo = document.getElementById('jumbo');
			cardColumns.innerHTML = '';
			jumbo.style.display = 'inline';
			localStorage.removeItem('clientes');
		}

		clientes.splice(clientes.indexOf(cliente), 1);
		localStorage.removeItem('clientes');
		localStorage.setItem('clientes', JSON.stringify(clientes))
		form.reset();
		let submitButton = document.getElementById('submit');
		submitButton.innerHTML = "ACTUALIZAR CLIENTE";

		cargarClientes();
	}
}

/**
 * Función que carga los clientes y los pinta,
 * en caso de no haber muestra mensaje informativo
 */
function cargarClientes() {

	let jumbo = document.getElementById('jumbo');
	clientes = JSON.parse(localStorage.getItem('clientes'));

	if (clientes != null && clientes.length > 0) {

		let padre = document.getElementById('cards-container');
		padre.innerHTML = '';
	    let div = document.createElement('div');
	    let row = document.createElement('div');

        div.className = 'contenedor-clientes';
        jumbo.style.display = 'none';
	    row.className = 'row';

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
			let buttonEliminar = document.createElement('a');
	
	
			col.className = 'row ml-5 mt-3 animate__animated animate__zoomInDown';
			card.className = 'card';
			body.className = 'card-body';
			title.className = 'card-title';
			p.className = 'card-text';
			p1.className = 'card-text';
			button.className = 'btn btn-info';
			button.text = 'ACTUALIZAR';

			button.addEventListener('click', function() {
				let submitButton = document.getElementById('submit');
				submitButton.innerHTML = "ACTUALIZAR CLIENTE";
				cargarClienteEnForm(cliente);
			}); 
			buttonEliminar.className = 'btn btn-danger ml-3';
			buttonEliminar.text = 'BORRAR';
			buttonEliminar.addEventListener('click', function() {
				eliminarCliente(cliente);
			}); 
	
			title.appendChild(textoTitulo);
			p.appendChild(textoBody);
			p1.appendChild(textoBody1);
			body.appendChild(title);
			body.appendChild(p);
			body.appendChild(p1);
			body.appendChild(button);
			body.appendChild(buttonEliminar);
			card.appendChild(body);
			col.appendChild(card);
			row.appendChild(col);
			div.appendChild(row);
			padre.appendChild(div);
		});
	}
	else {
		let p = document.getElementById('no-clientes');
		let submitButton = document.getElementById('submit');
		submitButton.innerHTML = "GUARDAR NUEVO CLIENTE";
		clientes = null;
		p.innerHTML = 'No hay clientes registrados...';
		p.style.color = 'red';
	}
}

/**
 * Función que comprueba si hay clientes, en caso de no haber
 * muestra mensaje informativo
 */
function hayClientes() {

	if (clientes == null || clientes.length === 0) {
		let p = document.getElementById('no-clientes');
		clientes = null;
		p.innerHTML = 'No hay clientes registrados...';
		p.style.color = 'red';
	}
}

/**
 * Comrueba con el método de la libreria si el nombre es correcto
 * en caso contrario, muestra el mensaje de error
 * @param {nombre a validar} value 
 */
function validarNombre(value) {

	let p = document.getElementById('pNombre');

	if (!libValidarCampoTexto(value)) {

        p.style.display = 'inline';
		p.style.color = 'red';
		nombre.focus();
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si el apellido es correcto
 * en caso contrario, muestra el mensaje de error
 * @param {apellido a validar} value 
 */
function validarApellido(value) {

	let p = document.getElementById('pApellido');

	if (!libValidarCampoTexto(value)) {
		
		p.style.display = 'inline';
        p.style.color = 'red';
		apellido.focus();
		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si el dni es correcto
 * en caso contrario, muestra el mensaje de error
 * @param {dni a validar} value 
 */
function validarDni(value) {
	let p = document.getElementById('pDni');

	if (!libValidarNif(value)) {

		p.style.display = 'inline';
        p.style.color = 'red';
		dni.focus();
		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si el email es correcto
 * en caso contrario, muestra el mensaje de error
 * @param {email a validar} value 
 */
function validarEmail(value) {
	let p = document.getElementById('pEmail');

	if (!libEsEmail(value)) {
		p.style.display = 'inline';
        p.style.color = 'red';
		email.focus();
		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si la fecha es correcta
 * en caso contrario, muestra el mensaje de error
 * @param {fecha a validar} value 
 */
function validarFechaNac(value) {
	
	let p = document.getElementById('pFecha');
	let year = parseInt(value.substring(0, 4));
	let actualYear = parseInt(new Date().getFullYear());
    if (!value) {

        p.style.display = 'inline';
        p.style.color = 'red';
		fechaNac.focus();
		return false;
    }
    else {

		if (year > actualYear + 18 || year < actualYear -100) {
			return false;
		}
        p.style.display = 'none';
		return true;
    }
}

/**
 * Comrueba con el método de la libreria si el password es correcto
 * en caso contrario, muestra el mensaje de error
 * @param {password a validar} value 
 */
function validarPassword(value) {

    let p = document.getElementById('pPass');

    if (value.length > 0) {
        p.style.display = 'none';
		return true;
    }
    else {

        p.style.display = 'inline';
        p.style.color = 'red';

		return false;
    }
}

/**
 * Carga el cliente en el formulario
 * @param {cliente a cargar} cliente 
 */
function cargarClienteEnForm(cliente) {
	
	clienteSeleccionado = cliente;
    nombre.value = cliente.nombre;
    apellido.value = cliente.apellido;
	dni.value = cliente.dni;
    fechaNac.value = cliente.fechaNac;
    email.value = cliente.email;
    password.value = cliente.password;

}

/**
 * Función que hace que el calendario solo muestre hasta 
 * el dia actual
 */
function setMaxDateInput() {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
 	if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
	today = yyyy+'-'+mm+'-'+dd;
	document.getElementById("fecha").setAttribute("max", today);
}