function libValidarNif(nif) {

	var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 
				  'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 
				  'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];
	var numero;
	var letra;
	var letraCorrecta;

	if (nif.length != 9) {
		return false;
	}
		
	numero = nif.substring(0, 8);
	letra = nif.substring(8, 9).toUpperCase();
	letraCorrecta = letras[numero % 23];

	if (letra != letraCorrecta) {
		return false;
	}

	return true;
}

function libExisteFecha(fecha){

	var fechaSplit = fecha.split("/");
	var day = parseInt(fechaSplit[0]);
	var month = parseInt(fechaSplit[1]);
	var year = parseInt(fechaSplit[2]);
	var date = new Date(year,month,'0');

	if (!isNaN(day) && year > 1900) {
		if((day)>(date.getDate() || day < 1)){
			return false;
		}	
		return true;
	}
	else 
		return false;
	
}

function libEsEmail(email) {

	if (email.indexOf('@') > -1 && email.indexOf('.') > -1 )
		return true;
		
	else 
		return false;
}

function libValidarCampoTexto(campoTexto) {
	
	if (campoTexto.length <= 0) {
		return false;
	}
	else 
		return true;
} 

function libValidarCheckBox(checkbox) {

	checkbox.forEach(dato => {
		if (dato.checked) {
			return true;
		}
	});
	return false;
}