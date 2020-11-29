var clientes = JSON.parse(localStorage.getItem('clientes'));
var form = document.getElementById('forma');
var nombre = form.nombre;
var apellido = form.apellido;
var dni = form.dni;
var fechaNac = form.fecha;
var email = form.email;
var password = form.pass;


function validarForm() {
	console.log(fechaNac.value);
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
		form.reset();
		saveCliente();
    }
 }

 function saveCliente() {

	if (confirm('¿Desea guardar el cliente?')) {

		let clientes = JSON.parse(localStorage.getItem('clientes'));

		let id;
		if (clientes != null) {

			id = clientes[clientes.length -1].id + 1;
			cliente = new Cliente(id, nombre, apellido, dni, fechaNac, password);
			cliente.push(cliente);
			localStorage.removeItem('clientes');
			localStorage.setItem('clientes', JSON.stringify(clientes));
		}
		else {

			id = 1;
			cliente = new Cliente(id, nombre, apellido, dni, fechaNac, password);
			cliente.push(cliente);
			localStorage.removeItem('clientes');
			localStorage.setItem('clientes', JSON.stringify(clientes));
		}
	}
 }

function cargarClientes() {

	if (clientes != null) {

        let jumbo = document.getElementById('jumbo');
	    let padre = document.getElementById('cards-container');
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
				let submitButton = document.getElementById('submit');
				submitButton.innerHTML = "ACTUALIZAR CLIENTE";
				cargarClienteEnForm(cliente);
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

function validarNombre(value) {

	let p = document.getElementById('pNombre');

	if (!libValidarCampoTexto(value)) {

        p.style.display = 'inline';
        p.style.color = 'red';
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

function validarApellido(value) {

	let p = document.getElementById('pApellido');

	if (!libValidarCampoTexto(value)) {
		
		p.style.display = 'inline';
        p.style.color = 'red';

		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

function validarDni(value) {
	let p = document.getElementById('pDni');

	if (!libValidarNif(value)) {

		p.style.display = 'inline';
        p.style.color = 'red';

		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

function validarEmail(value) {
	let p = document.getElementById('pEmail');

	if (!libEsEmail(value)) {
		p.style.display = 'inline';
        p.style.color = 'red';

		return false;
	}
	else {
		p.style.display = 'none';
		return true;
	}
}

function validarFechaNac(value) {

    let p = document.getElementById('pFecha');

    if (!value) {

        p.style.display = 'inline';
        p.style.color = 'red';

		return false;
    }
    else {
        p.style.display = 'none';
		return true;
    }
}

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

function cargarClienteEnForm(cliente) {
    nombre.value = cliente.nombre;
    apellido.value = cliente.apellido;
	dni.value = cliente.dni;
    fechaNac.value = "1982-12-21";
    email.value = cliente.email;
    password.value = cliente.password;

}