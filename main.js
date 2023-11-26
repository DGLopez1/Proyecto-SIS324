

function cargarContenido(content) {
    var contenido = document.getElementById('contenido');
    fetch(content)
        .then(response => response.text())
        .then(data => contenido.innerHTML = data)
        .catch(error => console.error('Error:', error));
}

function abrirLogin() {
    // Abre la ruta /Views/login definida en router.js en una nueva ventana
    window.open('/Views/login', '_blank');
}




// dsks