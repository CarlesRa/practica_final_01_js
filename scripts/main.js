

if (!cookieExistsMain('data','cargada')) {
	console.log('cargo clientes');
	//cargo los artículos
	var articulos = [
		new Articulo(1,'Sobremesa', 'El mejor', 'Ordenadores', 500.25),
		new Articulo(2, 'Portatil', 'Vivo book', 'Portátiles', 600.50),
		new Articulo(3, 'Disco SSD', 'super rápido', 'Componentes', 245),
		new Articulo(4, 'Ratón', 'Gaming', 'Perifericos', 22.75)
	];

	localStorage.setItem('articulos', JSON.stringify(articulos)); 


	//Cargo los clientes
	var cliente = new Cliente(1, 'Pepe', 'Rodrigez Prieto', '543456567y', "1982-12-23", 'jc@g.com', 'pepe');
	var cliente1 = new Cliente(2, 'Manolo', 'Fonambulo Martinez', '10296699J', "1988-12-23", 'jc@g.com', 'manolo');
	var cliente2 = new Cliente(3, 'Martina', 'Ramos Moll', '96294365N', "1982-12-23", 'jc@g.com', 'martina');
	var cliente3 = new Cliente(4, 'Maria', 'Manolo Fenandez', '92142898E', "1982-12-23", 'jc@g.com', 'maria');
	var clientes = [
		cliente, cliente1, cliente2, cliente3,
	];
	document.cookie = 'data=cargada';
	localStorage.setItem('clientes', JSON.stringify(clientes));
}



function cookieExistsMain(name, value) {

	let cookie = document.cookie.split(';');
	let index = cookie.indexOf(name + '=' + value);

	if (index === -1) {
		return false;
	}
	else {
		return true;
	}
}