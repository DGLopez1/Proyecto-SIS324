// const { response } = require("express");


function cargarContenido(content) {
    var contenido = document.getElementById('contenido');
    fetch(content)
        .then(response => response.text())
        .then(data => contenido.innerHTML = data)
        .catch(error => console.error('Error:', error));
}

function cargarFormCrearCuenta(content) {
  var contenido = document.getElementById('container');
  fetch(content)
      .then(response => response.text())
      .then(data => contenido.innerHTML = data)
      .catch(error => console.error('Error:', error));
}

function cargarMedicos() {
    cargarContenido('/medicos');
}
function cargarAbout() {
    cargarContenido('/about');
}

function cargarMedico() {
    var contenido = document.getElementById('contenido');
    var dato = document.getElementById('dato').value;

    fetch("/medicos?dato=" + dato)
      .then((response) => response.text())
      .then((data) => (contenido.innerHTML = data))
      .catch(error => console.error('Error:', error));
}


function cargarEspecialidades(){
  cargarContenido('/especialidades');
}


function abrirLogin() {
    // Abre la ruta /Views/login definida en router.js en una nueva ventana
    window.open('/Views/login', '_blank');
}


function cargarGestionMedicos() {
  
  cargarContenido('/Views/gestionMedicos');
}


function cargarGestionUsuarios() {
    cargarContenido('/Views/gestionUsuarios');
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




function volverInicio() {
  window.location.href = '/Views/inicio.ejs';
}





//? GESTION DE USUARIOS

// PARA EL CREATE
function enviarFormularioCreate() {
  var nombre = document.getElementById('nombre').value;
  var apellido = document.getElementById('apellido').value;
  var cuenta = document.getElementById('cuenta').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var rol = document.getElementById('rol').value;

  // Realiza la solicitud para crear un usuario
  fetch("/createUsuario", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          nombre: nombre,
          apellido: apellido,
          cuenta: cuenta,
          email: email,
          password: password,
          rol: rol
      })
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          // Muestra un mensaje de éxito si lo deseas
          console.log(data.message);
          
          // Después de cargar el formulario, realiza una solicitud para cargar la lista de usuarios
          cargarGestionUsuarios();
      } else {
          // Muestra mensajes de error si lo deseas
          console.error(data.message);
      }
  })
  .catch(error => console.error('Error:', error));

  // Retorna false para evitar que el formulario se envíe de la manera tradicional
  return false;
}



function cargarFormRegister(content) {
  var contenido = document.getElementById('container-usuarios');
  
  fetch(content)
      .then(response => response.text())
      .then(data => {
          contenido.innerHTML = data;
      })
      .catch(error => console.error('Error:', error));
}




//? PARA EL UPDATE DEL USUARIO

function cargarFormEdit(content) {
  var contenido = document.getElementById('container-usuarios');
  
  fetch(content)
      .then(response => response.text())
      .then(data => {
          contenido.innerHTML = data;
      })
      .catch(error => console.error('Error:', error));
}

function editarUsuario(userId) {
  cargarFormEdit(`/Views/editUsuario/${userId}`);
}


function enviarFormularioUpdate(userId) {

  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const cuenta = document.getElementById('cuenta').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rol = document.getElementById('rol').value;

  const updatedUserData = {
    nombre: nombre,
    apellido: apellido,
    cuenta: cuenta,
    email: email,
    password: password,
    rol: rol
  };

  fetch(`/editUsuario/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUserData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        cargarGestionUsuarios();
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error:', error));

  return false;
}




//? Para el metodo DELETE USUARIOS
function eliminarUsuario(userId) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    // Realiza la solicitud fetch para eliminar el usuario
    fetch(`/deleteUsuario/${userId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Recarga la gestión de usuarios después de la eliminación
        cargarGestionUsuarios();
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  }
}






//todo:  GESTION DE MEDICOS

function cargarFormRegisterMedico(content) {
  var contenido = document.getElementById('container-medicos');
  
  fetch(content)
      .then(response => response.text())
      .then(data => {
          contenido.innerHTML = data;
      })
      .catch(error => console.error('Error:', error));
}


function enviarFormCreateMedico(){

  // alert('entro');

  var fotografia = document.getElementById('fotografia').value;
  var nombre = document.getElementById('nombre-medico').value;
  var apellido = document.getElementById('apellido-medico').value;
  var telefono = document.getElementById('telefono').value;
  var email = document.getElementById('email-medico').value;
  var descripcion = document.getElementById('descripcion').value;
  var educacion = document.getElementById('educacion').value;
  var direccion = document.getElementById('direccion').value;
  var horarios = document.getElementById('horarios').value;
  var id_especialidad = document.getElementById('id_especialidad').value;


  fetch('/createMedico',{
    method: 'POST',
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fotografia: fotografia,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      email: email,
      descripcion: descripcion,
      educacion: educacion,
      direccion: direccion,
      horarios: horarios,
      id_especialidad: id_especialidad
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(data.message);
      cargarGestionMedicos();
      // window.location.href = '/Views/gestionMedicos';
    } else {
        console.error(data.message);
    }
  })
  .catch(error => console.error('Error:', error));
  return false;
}






//? PARA EL UPDATE MEDICOS
function cargarFormEditMedico(content) {
  var contenido = document.getElementById('container-medicos');
  
  fetch(content)
      .then(response => response.text())
      .then(data => {
          contenido.innerHTML = data;
      })
      .catch(error => console.error('Error:', error));
}

function editarMedico(userId) {
  cargarFormEditMedico(`/Views/editMedico/${userId}`);
}


function enviarFormularioUpdateMedico(userId) {
  
  var fotografia = document.getElementById('fotografia').value;
  var nombre = document.getElementById('nombre-medico').value;
  var apellido = document.getElementById('apellido-medico').value;
  var telefono = document.getElementById('telefono').value;
  var email = document.getElementById('email-medico').value;
  var descripcion = document.getElementById('descripcion').value;
  var educacion = document.getElementById('educacion').value;
  var direccion = document.getElementById('direccion').value;
  var horarios = document.getElementById('horarios').value;
  var id_especialidad = document.getElementById('id_especialidad').value;

  // Construir el objeto de datos para enviar al servidor
  const updatedMedicoData = {
    fotografia: fotografia,
    nombre: nombre,
    apellido: apellido,
    telefono: telefono,
    email: email,
    descripcion: descripcion,
    educacion: educacion,
    direccion: direccion,
    horarios: horarios,
    id_especialidad: id_especialidad
  };

  fetch(`/editMedico/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedMedicoData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        cargarGestionMedicos();
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error:', error));

  return false;
}




//? Para el metodo DELETE MEDICOS
function eliminarMedico(userId) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {

    fetch(`/deleteMedico/${userId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        cargarGestionMedicos();
      } else {
        console.error(data.message);
      }
    })
    .catch(error => console.error('Error:', error));
  }
}
