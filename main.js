

function cargarContenido(content) {
    var contenido = document.getElementById('contenido');
    fetch(content)
        .then(response => response.text())
        .then(data => contenido.innerHTML = data)
        .catch(error => console.error('Error:', error));
}

function cargarMedicos() {
    cargarContenido('/medicos');
}

function cargarMedico() {
    var contenido = document.getElementById('contenido');
    var dato = document.getElementById('dato').value;

    fetch("/medicos?dato=" + dato)
      .then((response) => response.text())
      .then((data) => (contenido.innerHTML = data))
      .catch(error => console.error('Error:', error));
}


function abrirLogin() {
    // Abre la ruta /Views/login definida en router.js en una nueva ventana
    window.open('/Views/login', '_blank');
}

function cargarGestionMedicos() {
    cargarContenido('/Views/gestionMedicos');
}

function cargarGestionUsuarios() {
    cargarContenido('/Views/gestionUsurios');
}
function cargarGestionEspecialidades() {
    cargarContenido('/Views/gestionEspecialidades');
}

function volverAtras(){
    var contenido = document.getElementById('contenido');
    contenido.innerHTML= `
    <h3>Administrador</h3>
    <header class="header" id="header">
    <button class="button" onclick="javascript:cargarGestionUsuarios()">
      Gestion de Usuarios
    </button>
    <button class="button" onclick="javascript:cargarGestionMedicos()">
      Gestion de Medicos
    </button>
    <button class="button" onclick="javascript:cargarGestionEspecialidades()">
      Gestion de Especialidad
    </button>
  </header>
    `
}

