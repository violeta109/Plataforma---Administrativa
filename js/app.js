let periodoActivo = "2026";

let listaCursos = [];
let listaProfesores = [];
let listaAlumnos = [];
let listaNotas = [];

console.log("Sistema cargado correctamente");
console.log("Periodo activo:", periodoActivo);

function cambiarVista(id){

    document.querySelectorAll('.modulo, .dashboard').forEach(function(seccion){
        seccion.classList.remove('activo');
    });

    var elemento = document.getElementById(id);

    if(elemento){
        elemento.classList.add('activo');
        activarMenu(id);
    }
}

function activarMenu(id){
    document.querySelectorAll('.menu button').forEach(btn =>{

        btn.classList.remove('activo');

        if(btn.getAttribute("onclick").includes("'" + id + "'")){
            btn.classList.add('activo');
        }

    });
}

//historial
function navegar(id){
    cambiarVista(id);
    history.pushState({seccion:id}, "", "#" + id);
}

function mostrarSeccion(id){
    navegar(id);
}

function mostrarModulo(id){
    navegar(id);
}

window.onpopstate = function(event){

    if(event.state && event.state.seccion){
        cambiarVista(event.state.seccion);
    }else{
        cambiarVista("inicio");
    }

};

window.onload = function(){

    var hash = location.hash.replace("#","");

    if(hash){
        cambiarVista(hash);
    }else{
        cambiarVista("inicio");
    }

};

function toggleMenu(){
    document.querySelector(".sidebar").classList.toggle("activo");
}
//funcion periodo

function cambiarPeriodo(){

    const nuevoPeriodo = document.getElementById("filtroPeriodo").value;
    periodoActivo = nuevoPeriodo;
    console.log("Periodo cambiado a:", periodoActivo);
    alert("Mostrando datos del periodo " + periodoActivo);
}

let filaEditando = null;

function guardarRegistro() {

    const form = event.target.closest("form");
    const inputs = form.querySelectorAll("input, select");
    const tabla = form.parentElement.querySelector("table");

    let datos = [];

    inputs.forEach(input => {
        datos.push(input.value);
    });

    if (filaEditando) {

        filaEditando.querySelectorAll("td").forEach((celda, index) => {
            if (index < datos.length) {
                celda.textContent = datos[index];
            }
        });

        filaEditando = null;

    } else {

        const nuevaFila = tabla.insertRow();

        datos.forEach(dato => {
            const celda = nuevaFila.insertCell();
            celda.textContent = dato;
        });

        const celdaAcciones = nuevaFila.insertCell();

        celdaAcciones.innerHTML = `
            <button onclick="editarRegistro(this)">Editar</button>
            <button onclick="eliminarRegistro(this)">Eliminar</button>
        `;
    }

    form.reset();
    alert("Registro guardado correctamente");
}

function editarRegistro(boton) {

    const fila = boton.closest("tr");
    const celdas = fila.querySelectorAll("td");
    const form = fila.closest("section").querySelector("form");
    const inputs = form.querySelectorAll("input, select");

    inputs.forEach((input, index) => {
        input.value = celdas[index].textContent;
    });

    filaEditando = fila;
}

function eliminarRegistro(boton) {
    abrirModalConfirmacion(boton.closest("tr"));
}

function cancelarFormulario(boton) {

    const form = boton.closest("form");
    form.reset();
    filaEditando = null;
}

let filaAEliminar = null;

function abrirModalConfirmacion(fila){
    filaAEliminar = fila;
    document.getElementById("modalConfirmacion").classList.add("activo");
}

function confirmarEliminacion(){
    if(filaAEliminar){
        filaAEliminar.remove();
        filaAEliminar = null;
    }
    cerrarModalConfirmacion();
}

function cerrarModalConfirmacion(){
    document.getElementById("modalConfirmacion").classList.remove("activo");
}

function toggleMenu(){
  document.querySelector(".sidebar").classList.toggle("activo");
}

/* calendario */

let fechaActual = new Date();
let eventos = [];

function mostrarVistaCalendario(){
    cambiarVista("vistaCalendario");
    generarCalendario();
}

function mostrarVistaCrearEvento(){
    cambiarVista("vistaCrearEvento");
}

function cambiarMes(valor){
    fechaActual.setMonth(fechaActual.getMonth() + valor);
    generarCalendario();
}


function generarCalendario(){

    const grid = document.getElementById("calendarioGrid");
    if(!grid) return;

    grid.innerHTML = "";

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    const nombresMes = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
    ];

    document.getElementById("tituloMes").textContent =
        nombresMes[mes] + " " + año;

    mostrarTrimestre(mes);

    const primerDia = new Date(año, mes, 1).getDay();
    const diasMes = new Date(año, mes + 1, 0).getDate();

    /* Espacios en blanco antes del día 1 */
    for(let i=0; i<primerDia; i++){
        grid.innerHTML += `<div></div>`;
    }

    for(let dia=1; dia<=diasMes; dia++){

        const mesFormateado = String(mes + 1).padStart(2, '0');
        const diaFormateado = String(dia).padStart(2, '0');

        const fechaTexto = `${año}-${mesFormateado}-${diaFormateado}`;

        let eventosDelDia = eventos.filter(e => e.fecha === fechaTexto);

        let htmlEventos = "";
        eventosDelDia.forEach(e=>{
            htmlEventos += `
                <div class="evento">
                    ${e.actividad}
                    <small>${e.curso}</small>
                </div>
            `;
        });

        grid.innerHTML += `
            <div class="dia">
                <strong>${dia}</strong>
                ${htmlEventos}
            </div>
        `;
    }
}

/*funcion trimestre */

function mostrarTrimestre(mes){

    let trimestre = "";

    if(mes >= 2 && mes <= 4){
        trimestre = "Primer Trimestre (Marzo - Mayo)";
    }
    else if(mes >= 5 && mes <= 7){
        trimestre = "Segundo Trimestre (Junio - Agosto)";
    }
    else if(mes >= 8 && mes <= 11){
        trimestre = "Tercer Trimestre (Septiembre - Diciembre)";
    }

    document.getElementById("trimestreActual").textContent = trimestre;
}

function guardarEvento(e){
    e.preventDefault();

    const actividad = document.getElementById("actividad").value;
    const fecha = document.getElementById("fecha").value;
    const curso = document.getElementById("cursoEvento").value;

    if(!actividad || !fecha || !curso){
        alert("Completa todos los campos");
        return;
    }

    eventos.push({
        actividad,
        fecha,
        curso
    });

    document.getElementById("actividad").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("cursoEvento").value = "";

    cambiarVista("vistaCalendario");
    generarCalendario();
}

const usuario = {
    nombre: "Luis Ramos",
    rol: "Docente",
    id: "DOC-2026",
    curso: "Desarrollo Web",
    correo: "luis@gmail.com",
    telefono: "987654321",
    foto: "img/user.png",
    password: "123456"
};

//funcion perfil
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("nombreUsuario").textContent = usuario.nombre;
    document.getElementById("rolUsuario").textContent = usuario.rol;
    document.getElementById("idUsuario").textContent = usuario.id;
    document.getElementById("cursoUsuario").textContent = usuario.curso;
    document.getElementById("correoUsuario").textContent = usuario.correo;
    document.getElementById("telefonoUsuario").textContent = usuario.telefono;
    document.getElementById("fotoPerfil").src = usuario.foto;

});

document.getElementById("subirFoto").addEventListener("change", function(e){
    const reader = new FileReader();
    reader.onload = function(){
        document.getElementById("fotoPerfil").src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

//funcion contraseña
function cambiarPassword(){
    let actual = document.getElementById("actualPass").value;
    let nueva = document.getElementById("nuevaPass").value;

    if(actual === usuario.password){
        usuario.password = nueva;
        alert("✅ Contraseña actualizada");
    }else{
        alert("❌ Contraseña incorrecta");
    }
}

function mostrarPassword(){
    let tipo = document.getElementById("actualPass");
    let tipo2 = document.getElementById("nuevaPass");

    tipo.type = tipo.type === "password" ? "text" : "password";
    tipo2.type = tipo2.type === "password" ? "text" : "password";
}

document.getElementById("modoOscuro").addEventListener("change", function(){
    document.body.classList.toggle("dark");
});

function guardarPreferencias(){
    alert("✅ Preferencias guardadas");
}