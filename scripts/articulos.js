var articulos = JSON.parse(localStorage.getItem('articulos'));
var articuloSeleccionado; //almacenare el artículo a modificar.
var form = document.getElementById('forma');
var referencia = form.referencia;
var descripcion = form.descripcion;
var familia = form.familia;
var precio = form.precio;

let buttonSubmit = document.getElementById('submit');

//Compruebo si hay artículos
hayArticulos();

/**
 * Función para validar el formulario 
 */
function validarForm() {

    let isOk = true;

    if (!validarReferencia(referencia.value)) {
        isOk = false;
    }
    else if (!validarDescripcion(descripcion.value)) {
        isOk = false;
    }
    else if (!validarFamilia(familia.value)) {
        isOk = false;
    }
    else if (!validarPrecio(precio.value)) {
        isOk = false;
	}
    if (isOk){
		saveArticulo();
    }
 }

/**
* Función que guarda el artículo
*/
function saveArticulo() {

	if (confirm('¿Desea guardar el artículo?')) {

		let buttonSubmit = document.getElementById('submit');

		if (buttonSubmit.textContent === "ACTUALIZAR ARTÍCULO") {
			
			articulos.splice(articulos.indexOf(articuloSeleccionado), 1);
			articuloSeleccionado.referencia = referencia.value;
			articuloSeleccionado.descripcion = descripcion.value;
			articuloSeleccionado.familia = familia.value;
			articuloSeleccionado.precio = precio.value;
			articulos.push(articuloSeleccionado);
		}
		else {
			let id;
			if (articulos != null && articulos.length > 0) {
	
				id = articulos[articulos.length -1].id + 1;	
			}
			else {
				id = 1;
			}
			let articulo = new Articulo(id, referencia.value, descripcion.value, 
									  familia.value, precio.value);
	
			if (articulos != null) {
				articulos.push(articulo);
			}
			else {
				articulos = new Array();
				articulos.push(articulo);
			}
		}

		localStorage.removeItem('articulos');
		localStorage.setItem('articulos', JSON.stringify(articulos));
		buttonSubmit.textContent = "GUARDAR NUEVO ARTÍCULO";
		form.reset();
		cargarArticulos();
	}
}

/**
 * Función que elimina un artículo
 * @param {artículo a eliminar} cliente 
 */
function eliminarArticulo(articulo) {

	if (confirm('¿Desea borrar el artículo ' + articulo.referencia +'?')) {

		if (articulos.length === 1) {
			let cardColumns = document.getElementById('cards-container');
			let jumbo = document.getElementById('jumbo');
			cardColumns.innerHTML = '';
			jumbo.style.display = 'inline';
		}
		articulos.splice(articulos.indexOf(articulo), 1);
		localStorage.removeItem('articulos');
		localStorage.setItem('articulos', JSON.stringify(articulos));
		let submitButton = document.getElementById('submit');
		submitButton.innerHTML = "GUARDAR NUEVO ARTÍCULO";
		cargarArticulos();
	}
}

/**
 * Función que determina si hay articulos en caso que no
 * muestra mensaje informativo
 */
function hayArticulos() {

	if (articulos == null || articulos.length === 0) {
		let p = document.getElementById('no-articulos');
		articulos = null;
		p.innerHTML = 'No hay artículos registrados...';
		p.style.color = 'red';
	}
}

/**
 * Función que carga los artículos y los pinta,
 * en caso de no haber muestra mensaje informativo
 */
function cargarArticulos() {

	let jumbo = document.getElementById('jumbo');
	articulos = JSON.parse(localStorage.getItem('articulos'));

	if (articulos != null && articulos.length > 0) {

		let padre = document.getElementById('cards-container');
		padre.innerHTML = '';
	    let div = document.createElement('div');
	    let row = document.createElement('div');

        div.className = 'contenedor-articulos';
        jumbo.style.display = 'none';
	    row.className = 'row';

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
			let button = document.createElement('a');
			let buttonEliminar = document.createElement('a');
	
	
			col.className = 'col ml-3 mt-3 animate__animated animate__zoomInDown';
			card.className = 'card';
			body.className = 'card-body';
			title.className = 'card-title';
			p.className = 'card-text';
			p1.className = 'card-text';
			button.className = 'btn btn-info';
			button.text = 'ACTUALIZAR';
			button.addEventListener('click', function() {
				let submitButton = document.getElementById('submit');
				submitButton.innerHTML = "ACTUALIZAR ARTÍCULO";
				cargarArticuloEnForm(articulo);
			}); 
			buttonEliminar.className = 'btn btn-danger ml-3';
			buttonEliminar.text = 'BORRAR';
			buttonEliminar.addEventListener('click', function() {
				let submitButton = document.getElementById('submit');
				submitButton.innerHTML = "ACTUALIZAR ARTÍCULO";
				eliminarArticulo(articulo);
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

		let p = document.getElementById('no-articulos');
		articulos = null;
		p.innerHTML = 'No hay artículos registrados...';
		p.style.color = 'red';
	}
}

/**
 * Comrueba con el método de la libreria si la referencia es correcta
 * en caso contrario, muestra el mensaje de error
 * @param {referencia a validar} value 
 */
function validarReferencia(value) {

	let p = document.getElementById('pReferencia');

	if (!libValidarCampoTexto(value)) {

        p.style.display = 'inline';
		p.style.color = 'red';
		referencia.focus();
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si la descripción es correcta
 * en caso contrario, muestra el mensaje de error
 * @param {referencia a validar} value 
 */
function validarDescripcion(value) {

	let p = document.getElementById('pDescripcion');

	if (!libValidarCampoTexto(value)) {

        p.style.display = 'inline';
		p.style.color = 'red';
		descripcion.focus();
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

/**
 * Comrueba con el método de la libreria si la familia es correcta
 * en caso contrario, muestra el mensaje de error
 * @param {familia a validar} value 
 */
function validarFamilia(value) {

	let p = document.getElementById('pFamilia');

	if (!libValidarCampoTexto(value)) {

        p.style.display = 'inline';
		p.style.color = 'red';
		familia.focus();
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

/**
 * Comprueba se el precio es un número
 * @param {precio a validar} value 
 */
function validarPrecio(value) {

	let p = document.getElementById('pPrecio');

	if (isNaN(value) || !value) {

        p.style.display = 'inline';
		p.style.color = 'red';
		precio.focus();
		return false;
	}
	else {
        p.style.display = 'none';
		return true;
	}
}

/**
 * Carga el artículo seleccionado en el formulario
 * @param {artículo a cargar} articulo 
 */
function cargarArticuloEnForm(articulo) {
	
	articuloSeleccionado = articulo;
    referencia.value = articulo.referencia;
    descripcion.value = articulo.descripcion;
	familia.value = articulo.familia;
    precio.value = articulo.precio;
}