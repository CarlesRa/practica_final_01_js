function cargarJson(path) {

}

function saveJson(ventas) {

    let xhttp = new XMLHttpRequest();
    xhttp.addEventListener('load', fileLoaded, false);
    xhttp.addEventListener('readystatechange', cambio, false);
    xhttp.open("POST","../scripts/guardar.php", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(ventas);
}

function fileLoaded(e) {
    console.log('loaded' + e);
}

function cambio(e) {
    console.log(e);
}