
// ========================================
// CONSTRUMARA - SISTEMA WEB
// Navegación y gestión de clientes
// ========================================

const API_URL = "/api";

console.log("API utilizada:", window.location.origin + API_URL);

// ========================================
// INICIAR APLICACIÓN
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const menuLinks = document.querySelectorAll(".menu-link");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");

    // Navegación entre módulos
    menuLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const sectionId = link.dataset.section;

            sections.forEach(section => {
                section.classList.remove("active");
            });

            menuLinks.forEach(item => {
                item.classList.remove("active");
            });

            const selectedSection = document.getElementById(sectionId);

            if (selectedSection) {
                selectedSection.classList.add("active");
                link.classList.add("active");
            }

            const titles = {
                inicio: "Panel principal",
                clientes: "Gestión de clientes",
                proyectos: "Gestión de proyectos",
                cotizaciones: "Gestión de cotizaciones",
                materiales: "Inventario de materiales"
            };

            pageTitle.textContent = titles[sectionId] || "Construmara";

            if (sectionId === "clientes") {
    cargarClientes();
}

if (sectionId === "proyectos") {
    cargarClientesEnProyectos();
    cargarProyectos();
}

if (sectionId === "cotizaciones") {
    cargarProyectosEnCotizaciones();
    cargarCotizaciones();
}

if (sectionId === "materiales") {
    cargarMateriales();
}

        });
    });

    // Preparar el módulo de clientes
    prepararModuloClientes();

    // Preparar el módulo de proyectos
    prepararModuloProyectos();

    // Preparar el módulo de cotizaciones
    prepararModuloCotizaciones();

    // Preparar el módulo de materiales
    prepararModuloMateriales();

        // Actualizar los indicadores del panel principal
    cargarClientes();
    cargarProyectos();
    cargarCotizaciones();
    cargarMateriales();

    console.log("Construmara: aplicación iniciada correctamente.");
});


// ========================================
// MENSAJES DEL SISTEMA
// ========================================

function mostrarMensaje(mensaje, tipo = "success") {

    let contenedor = document.getElementById("mensaje-sistema");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "mensaje-sistema";

        const main = document.querySelector(".main-content");
        main.prepend(contenedor);
    }

    contenedor.innerHTML = `
        <div class="alert alert-${tipo}" role="alert">
            ${mensaje}
        </div>
    `;

    setTimeout(() => {
        contenedor.innerHTML = "";
    }, 4000);
}


// ========================================
// PROTEGER TEXTO MOSTRADO EN LA TABLA
// ========================================

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caracter]);
}


// ========================================
// PREPARAR MÓDULO CLIENTES
// ========================================

function prepararModuloClientes() {

    const contenedor = document.getElementById("contenido-clientes");

    contenedor.innerHTML = `

        <div class="info-card mb-4">

            <h4 id="titulo-formulario">Registrar nuevo cliente</h4>

            <form id="formulario-cliente">

                <input type="hidden" id="id_cliente">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label class="form-label">Nombre completo *</label>
                        <input type="text" id="nombre" class="form-control"
                            placeholder="Nombre del cliente" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Documento *</label>
                        <input type="text" id="documento" class="form-control"
                            placeholder="Número de documento" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Teléfono</label>
                        <input type="tel" id="telefono" class="form-control"
                            placeholder="Número de teléfono">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Correo electrónico</label>
                        <input type="email" id="correo" class="form-control"
                            placeholder="Correo electrónico">
                    </div>

                    <div class="col-12">
                        <label class="form-label">Dirección</label>
                        <input type="text" id="direccion" class="form-control"
                            placeholder="Dirección del cliente">
                    </div>

                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary" id="boton-guardar">
                        Registrar cliente
                    </button>

                    <button type="button" class="btn btn-secondary"
                        id="boton-cancelar" hidden>
                        Cancelar edición
                    </button>
                </div>

            </form>

        </div>

        <div class="info-card">

            <h4>Clientes registrados</h4>

            <div class="table-responsive mt-3">

                <table class="table table-hover align-middle">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-clientes">
                        <tr>
                            <td colspan="7">Cargando clientes...</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </div>
    `;

    document.getElementById("formulario-cliente")
        .addEventListener("submit", guardarCliente);

    document.getElementById("boton-cancelar")
        .addEventListener("click", cancelarEdicion);

    document.getElementById("tabla-clientes")
        .addEventListener("click", gestionarAccionesCliente);
}


// ========================================
// CONSULTAR CLIENTES
// ========================================

async function cargarClientes() {

    const tabla = document.getElementById("tabla-clientes");

    try {

        const respuesta = await fetch(`${API_URL}/clientes`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los clientes.");
        }

        const clientes = await respuesta.json();

        tabla.innerHTML = "";

        document.getElementById("total-clientes").textContent =
            clientes.length;

        if (clientes.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7">No hay clientes registrados.</td>
                </tr>
            `;
            return;
        }

        clientes.forEach(cliente => {

            tabla.innerHTML += `
                <tr>
                    <td>${escaparHTML(cliente.id_cliente)}</td>
                    <td>${escaparHTML(cliente.nombre)}</td>
                    <td>${escaparHTML(cliente.documento)}</td>
                    <td>${escaparHTML(cliente.telefono)}</td>
                    <td>${escaparHTML(cliente.correo)}</td>
                    <td>${escaparHTML(cliente.direccion)}</td>

                    <td>
                        <button class="btn btn-sm btn-warning"
                            data-accion="editar"
                            data-id="${escaparHTML(cliente.id_cliente)}">
                            Editar
                        </button>

                        <button class="btn btn-sm btn-danger"
                            data-accion="eliminar"
                            data-id="${escaparHTML(cliente.id_cliente)}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="7">Error al cargar los clientes.</td>
            </tr>
        `;

        mostrarMensaje("No se pudieron consultar los clientes.", "danger");
    }
}


// ========================================
// REGISTRAR Y ACTUALIZAR CLIENTES
// ========================================

async function guardarCliente(event) {

    event.preventDefault();

    const id = document.getElementById("id_cliente").value;

    const cliente = {
        nombre: document.getElementById("nombre").value.trim(),
        documento: document.getElementById("documento").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        direccion: document.getElementById("direccion").value.trim()
    };

    if (!cliente.nombre || !cliente.documento) {
        mostrarMensaje("El nombre y el documento son obligatorios.", "danger");
        return;
    }

    const metodo = id ? "PUT" : "POST";

    const url = id
        ? `${API_URL}/clientes/${encodeURIComponent(id)}`
        : `${API_URL}/clientes`;

    try {

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo guardar el cliente.");
        }

        mostrarMensaje(resultado.mensaje, "success");

        document.getElementById("formulario-cliente").reset();

        cancelarEdicion();

        await cargarClientes();

    } catch (error) {

        mostrarMensaje(error.message, "danger");
    }
}


// ========================================
// CARGAR DATOS PARA EDITAR
// ========================================

async function editarCliente(id) {

    try {

        const respuesta = await fetch(
            `${API_URL}/clientes/${encodeURIComponent(id)}`
        );

        const cliente = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(cliente.mensaje || "No se encontró el cliente.");
        }

        document.getElementById("id_cliente").value = cliente.id_cliente;
        document.getElementById("nombre").value = cliente.nombre;
        document.getElementById("documento").value = cliente.documento;
        document.getElementById("telefono").value = cliente.telefono || "";
        document.getElementById("correo").value = cliente.correo || "";
        document.getElementById("direccion").value = cliente.direccion || "";

        document.getElementById("titulo-formulario").textContent =
            "Actualizar información del cliente";

        document.getElementById("boton-guardar").textContent =
            "Guardar cambios";

        document.getElementById("boton-cancelar").hidden = false;

        document.getElementById("formulario-cliente")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {

        mostrarMensaje(error.message, "danger");
    }
}


// ========================================
// ELIMINAR CLIENTES
// ========================================

async function eliminarCliente(id) {

    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar este cliente?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/clientes/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo eliminar el cliente.");
        }

        mostrarMensaje(resultado.mensaje, "success");

        await cargarClientes();

    } catch (error) {

        mostrarMensaje(error.message, "danger");
    }
}


// ========================================
// GESTIONAR BOTONES DE LA TABLA
// ========================================

function gestionarAccionesCliente(event) {

    const boton = event.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "editar") {
        editarCliente(id);
    }

    if (accion === "eliminar") {
        eliminarCliente(id);
    }
}


// ========================================
// CANCELAR EDICIÓN
// ========================================

function cancelarEdicion() {

    document.getElementById("formulario-cliente").reset();

    document.getElementById("id_cliente").value = "";

    document.getElementById("titulo-formulario").textContent =
        "Registrar nuevo cliente";

    document.getElementById("boton-guardar").textContent =
        "Registrar cliente";

    document.getElementById("boton-cancelar").hidden = true;
}

// ========================================
// PREPARAR MÓDULO PROYECTOS
// ========================================


// ========================================
// CARGAR CLIENTES EN EL FORMULARIO DE PROYECTOS
// ========================================

async function cargarClientesEnProyectos() {

    const select = document.getElementById("proyecto_cliente");

    try {

        const respuesta = await fetch(`${API_URL}/clientes`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los clientes.");
        }

        const clientes = await respuesta.json();

        select.innerHTML = `
            <option value="">Seleccionar cliente...</option>
        `;

        clientes.forEach(cliente => {

            select.innerHTML += `
                <option value="${escaparHTML(cliente.id_cliente)}">
                    ${escaparHTML(cliente.nombre)} - ${escaparHTML(cliente.documento)}
                </option>
            `;

        });

        if (clientes.length === 0) {
            mostrarMensaje(
                "Primero debes registrar un cliente para crear un proyecto.",
                "warning"
            );
        }

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudieron cargar los clientes para el proyecto.",
            "danger"
        );

    }
}

// ========================================
// PREPARAR MÓDULO PROYECTOS
// ========================================

function prepararModuloProyectos() {
    const contenedor = document.getElementById("contenido-proyectos");

    contenedor.innerHTML = `

        <div class="info-card mb-4">

            <h4 id="titulo-formulario-proyecto">Registrar nuevo proyecto</h4>

            <form id="formulario-proyecto">

                <input type="hidden" id="id_proyecto">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label class="form-label">Cliente *</label>
                        <select id="proyecto_cliente" class="form-select" required>
                            <option value="">Seleccionar cliente...</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Nombre del proyecto *</label>
                        <input type="text" id="proyecto_nombre"
                            class="form-control"
                            placeholder="Nombre del proyecto" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Tipo de obra *</label>
                        <select id="proyecto_tipo_obra" class="form-select" required>
                            <option value="">Seleccionar tipo de obra...</option>
                            <option value="Construcción">Construcción</option>
                            <option value="Remodelación">Remodelación</option>
                            <option value="Instalación eléctrica">Instalación eléctrica</option>
                            <option value="Drywall y cielo raso">Drywall y cielo raso</option>
                            <option value="Vidriería">Vidriería</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Presupuesto</label>
                        <input type="number" id="proyecto_presupuesto"
                            class="form-control"
                            placeholder="Valor del proyecto"
                            min="0" step="0.01">
                    </div>

                    <div class="col-12">
                        <label class="form-label">Descripción</label>
                        <textarea id="proyecto_descripcion"
                            class="form-control" rows="3"
                            placeholder="Describe los detalles del proyecto"></textarea>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Estado</label>
                        <select id="proyecto_estado" class="form-select">
                            <option value="Pendiente">Pendiente</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Fecha de inicio</label>
                        <input type="date" id="proyecto_fecha_inicio"
                            class="form-control">
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Fecha de finalización</label>
                        <input type="date" id="proyecto_fecha_fin"
                            class="form-control">
                    </div>

                </div>

                <div class="mt-4">

                    <button type="submit" class="btn btn-primary"
                        id="boton-guardar-proyecto">
                        Registrar proyecto
                    </button>

                    <button type="button" class="btn btn-secondary"
                        id="boton-cancelar-proyecto" hidden>
                        Cancelar edición
                    </button>

                </div>

            </form>

        </div>

        <div class="info-card">

            <h4>Proyectos registrados</h4>

            <div class="table-responsive mt-3">

                <table class="table table-hover align-middle">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Proyecto</th>
                            <th>Cliente</th>
                            <th>Tipo de obra</th>
                            <th>Presupuesto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-proyectos">
                        <tr>
                            <td colspan="7">Cargando proyectos...</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </div>

    `;
    document.getElementById("formulario-proyecto")
        .addEventListener("submit", guardarProyecto);

    document.getElementById("boton-cancelar-proyecto")
        .addEventListener("click", cancelarEdicionProyecto);

    document.getElementById("tabla-proyectos")
        .addEventListener("click", gestionarAccionesProyecto);
}
// ========================================
// CONSULTAR PROYECTOS
// ========================================

async function cargarProyectos() {

    const tabla = document.getElementById("tabla-proyectos");

    try {

        const respuesta = await fetch(`${API_URL}/proyectos`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los proyectos.");
        }

        const proyectos = await respuesta.json();

        tabla.innerHTML = "";

        document.getElementById("total-proyectos").textContent =
            proyectos.length;

        if (proyectos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7">No hay proyectos registrados.</td>
                </tr>
            `;
            return;
        }

        proyectos.forEach(proyecto => {

            tabla.innerHTML += `
                <tr>
                    <td>${escaparHTML(proyecto.id_proyecto)}</td>
                    <td>${escaparHTML(proyecto.nombre)}</td>
                    <td>${escaparHTML(proyecto.nombre_cliente)}</td>
                    <td>${escaparHTML(proyecto.tipo_obra)}</td>
                    <td>$ ${Number(proyecto.presupuesto || 0).toLocaleString("es-CO")}</td>
                    <td>${escaparHTML(proyecto.estado)}</td>

                    <td>
                        <button class="btn btn-sm btn-warning"
                            data-accion="editar"
                            data-id="${escaparHTML(proyecto.id_proyecto)}">
                            Editar
                        </button>

                        <button class="btn btn-sm btn-danger"
                            data-accion="eliminar"
                            data-id="${escaparHTML(proyecto.id_proyecto)}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="7">Error al cargar los proyectos.</td>
            </tr>
        `;

        mostrarMensaje("No se pudieron consultar los proyectos.", "danger");

    }
}

// ========================================
// REGISTRAR Y ACTUALIZAR PROYECTOS
// ========================================

async function guardarProyecto(event) {

    event.preventDefault();

    const id = document.getElementById("id_proyecto").value;

    const proyecto = {
        id_cliente: document.getElementById("proyecto_cliente").value,
        nombre: document.getElementById("proyecto_nombre").value.trim(),
        tipo_obra: document.getElementById("proyecto_tipo_obra").value,
        descripcion: document.getElementById("proyecto_descripcion").value.trim(),
        presupuesto: Number(document.getElementById("proyecto_presupuesto").value) || 0,
        estado: document.getElementById("proyecto_estado").value,
        fecha_inicio: document.getElementById("proyecto_fecha_inicio").value || null,
        fecha_fin: document.getElementById("proyecto_fecha_fin").value || null
    };

    if (!proyecto.id_cliente || !proyecto.nombre || !proyecto.tipo_obra) {
        mostrarMensaje(
            "El cliente, el nombre y el tipo de obra son obligatorios.",
            "danger"
        );
        return;
    }

    const metodo = id ? "PUT" : "POST";

    const url = id
        ? `${API_URL}/proyectos/${encodeURIComponent(id)}`
        : `${API_URL}/proyectos`;

    try {

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(proyecto)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo guardar el proyecto."
            );
        }

        mostrarMensaje(resultado.mensaje, "success");

        document.getElementById("formulario-proyecto").reset();

        cancelarEdicionProyecto();

        await cargarProyectos();

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}

// ========================================
// CARGAR DATOS PARA EDITAR PROYECTOS
// ========================================

async function editarProyecto(id) {

    try {

        const respuesta = await fetch(
            `${API_URL}/proyectos/${encodeURIComponent(id)}`
        );

        const proyecto = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(proyecto.mensaje || "No se encontró el proyecto.");
        }

        await cargarClientesEnProyectos();

        document.getElementById("id_proyecto").value = proyecto.id_proyecto;
        document.getElementById("proyecto_cliente").value = proyecto.id_cliente;
        document.getElementById("proyecto_nombre").value = proyecto.nombre;
        document.getElementById("proyecto_tipo_obra").value = proyecto.tipo_obra;
        document.getElementById("proyecto_descripcion").value = proyecto.descripcion || "";
        document.getElementById("proyecto_presupuesto").value = proyecto.presupuesto || 0;
        document.getElementById("proyecto_estado").value = proyecto.estado || "Pendiente";
        document.getElementById("proyecto_fecha_inicio").value =
            proyecto.fecha_inicio ? String(proyecto.fecha_inicio).substring(0, 10) : "";
        document.getElementById("proyecto_fecha_fin").value =
            proyecto.fecha_fin ? String(proyecto.fecha_fin).substring(0, 10) : "";

        document.getElementById("titulo-formulario-proyecto").textContent =
            "Actualizar información del proyecto";

        document.getElementById("boton-guardar-proyecto").textContent =
            "Guardar cambios";

        document.getElementById("boton-cancelar-proyecto").hidden = false;

        document.getElementById("formulario-proyecto")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}

// ========================================
// ELIMINAR PROYECTOS
// ========================================

async function eliminarProyecto(id) {

    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar este proyecto?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/proyectos/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo eliminar el proyecto."
            );
        }

        mostrarMensaje(resultado.mensaje, "success");

        await cargarProyectos();

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}

// ========================================
// GESTIONAR BOTONES DE LA TABLA DE PROYECTOS
// ========================================

function gestionarAccionesProyecto(event) {

    const boton = event.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "editar") {
        editarProyecto(id);
    }

    if (accion === "eliminar") {
        eliminarProyecto(id);
    }
}

// ========================================
// CANCELAR EDICIÓN DE PROYECTOS
// ========================================

function cancelarEdicionProyecto() {

    document.getElementById("formulario-proyecto").reset();

    document.getElementById("id_proyecto").value = "";

    document.getElementById("titulo-formulario-proyecto").textContent = "Registrar nuevo proyecto";

    document.getElementById("boton-guardar-proyecto").textContent = "Registrar proyecto";

    document.getElementById("boton-cancelar-proyecto").hidden = true;
}


// ========================================
// PREPARAR MÓDULO COTIZACIONES
// ========================================

function prepararModuloCotizaciones() {

    const contenedor = document.getElementById("contenido-cotizaciones");

    contenedor.innerHTML = `

        <div class="info-card mb-4">

            <h4 id="titulo-formulario-cotizacion">Registrar nueva cotización</h4>

            <form id="formulario-cotizacion">

                <input type="hidden" id="id_cotizacion">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label class="form-label">Proyecto *</label>
                        <select id="cotizacion_proyecto" class="form-select" required>
                            <option value="">Seleccionar proyecto...</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Fecha *</label>
                        <input type="date" id="cotizacion_fecha"
                            class="form-control" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Total de la cotización</label>
                        <input type="number" id="cotizacion_total"
                            class="form-control"
                            placeholder="Valor de la cotización"
                            min="0" step="0.01">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Estado</label>
                        <select id="cotizacion_estado" class="form-select">
                            <option value="Borrador">Borrador</option>
                            <option value="Enviada">Enviada</option>
                            <option value="Aprobada">Aprobada</option>
                            <option value="Rechazada">Rechazada</option>
                        </select>
                    </div>

                    <div class="col-12">
                        <label class="form-label">Descripción</label>
                        <textarea id="cotizacion_descripcion"
                            class="form-control" rows="3"
                            placeholder="Describe los detalles de la cotización"></textarea>
                    </div>

                </div>

                <div class="mt-4">

                    <button type="submit" class="btn btn-primary"
                        id="boton-guardar-cotizacion">
                        Registrar cotización
                    </button>

                    <button type="button" class="btn btn-secondary"
                        id="boton-cancelar-cotizacion" hidden>
                        Cancelar edición
                    </button>

                </div>

            </form>

        </div>

        <div class="info-card">

            <h4>Cotizaciones registradas</h4>

            <div class="table-responsive mt-3">

                <table class="table table-hover align-middle">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Proyecto</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-cotizaciones">
                        <tr>
                            <td colspan="7">Cargando cotizaciones...</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </div>

    `;

    document.getElementById("formulario-cotizacion")
        .addEventListener("submit", guardarCotizacion);

    document.getElementById("boton-cancelar-cotizacion")
        .addEventListener("click", cancelarEdicionCotizacion);

    document.getElementById("tabla-cotizaciones")
        .addEventListener("click", gestionarAccionesCotizacion);

}


// ========================================
// CARGAR PROYECTOS EN COTIZACIONES
// ========================================

async function cargarProyectosEnCotizaciones() {

    const select = document.getElementById("cotizacion_proyecto");

    try {

        const respuesta = await fetch(`${API_URL}/proyectos`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los proyectos.");
        }

        const proyectos = await respuesta.json();

        select.innerHTML = `
            <option value="">Seleccionar proyecto...</option>
        `;

        proyectos.forEach(proyecto => {

            select.innerHTML += `
                <option value="${escaparHTML(proyecto.id_proyecto)}">
                    ${escaparHTML(proyecto.nombre)}
                </option>
            `;

        });

    } catch (error) {

        console.error(error);

        mostrarMensaje("No se pudieron cargar los proyectos para las cotizaciones.", "danger");

    }
}
// ========================================
// CONSULTAR COTIZACIONES
// ========================================

async function cargarCotizaciones() {

    const tabla = document.getElementById("tabla-cotizaciones");

    try {

        const respuesta = await fetch(`${API_URL}/cotizaciones`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar las cotizaciones.");
        }

        const cotizaciones = await respuesta.json();

        tabla.innerHTML = "";

        document.getElementById("total-cotizaciones").textContent =
            cotizaciones.length;

        if (cotizaciones.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="7">No hay cotizaciones registradas.</td>
                </tr>
            `;

            return;
        }

        cotizaciones.forEach(cotizacion => {

            tabla.innerHTML += `
                <tr>
                    <td>${escaparHTML(cotizacion.id_cotizacion)}</td>
                    <td>${escaparHTML(cotizacion.nombre_proyecto)}</td>
                    <td>${escaparHTML(String(cotizacion.fecha).substring(0, 10))}</td>
                    <td>${escaparHTML(cotizacion.descripcion || "Sin descripción")}</td>
                    <td>$ ${Number(cotizacion.total || 0).toLocaleString("es-CO")}</td>
                    <td>${escaparHTML(cotizacion.estado)}</td>

                    <td>
                        <button class="btn btn-sm btn-warning"
                            data-accion="editar"
                            data-id="${escaparHTML(cotizacion.id_cotizacion)}">
                            Editar
                        </button>

                        <button class="btn btn-sm btn-danger"
                            data-accion="eliminar"
                            data-id="${escaparHTML(cotizacion.id_cotizacion)}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        tabla.innerHTML = `
            <tr>
                <td colspan="7">Error al cargar las cotizaciones.</td>
            </tr>
        `;

        mostrarMensaje("No se pudieron consultar las cotizaciones.", "danger");

    }
}
// ========================================
// REGISTRAR Y ACTUALIZAR COTIZACIONES
// ========================================

async function guardarCotizacion(event) {

    event.preventDefault();

    const id = document.getElementById("id_cotizacion").value;

    const cotizacion = {
        id_proyecto: document.getElementById("cotizacion_proyecto").value,
        fecha: document.getElementById("cotizacion_fecha").value,
        descripcion: document.getElementById("cotizacion_descripcion").value.trim(),
        total: Number(document.getElementById("cotizacion_total").value) || 0,
        estado: document.getElementById("cotizacion_estado").value
    };

    if (!cotizacion.id_proyecto || !cotizacion.fecha) {

        mostrarMensaje(
            "El proyecto y la fecha son obligatorios.",
            "danger"
        );

        return;
    }

    const metodo = id ? "PUT" : "POST";

    const url = id
        ? `${API_URL}/cotizaciones/${encodeURIComponent(id)}`
        : `${API_URL}/cotizaciones`;

    try {

        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cotizacion)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo guardar la cotización."
            );
        }

        mostrarMensaje(resultado.mensaje, "success");

        document.getElementById("formulario-cotizacion").reset();

        cancelarEdicionCotizacion();

        await cargarCotizaciones();

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}
// ========================================
// CARGAR DATOS PARA EDITAR COTIZACIONES
// ========================================

async function editarCotizacion(id) {

    try {

        const respuesta = await fetch(
            `${API_URL}/cotizaciones/${encodeURIComponent(id)}`
        );

        const cotizacion = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                cotizacion.mensaje || "No se encontró la cotización."
            );
        }

        await cargarProyectosEnCotizaciones();

        document.getElementById("id_cotizacion").value =
            cotizacion.id_cotizacion;

        document.getElementById("cotizacion_proyecto").value =
            cotizacion.id_proyecto;

        document.getElementById("cotizacion_fecha").value =
            String(cotizacion.fecha).substring(0, 10);

        document.getElementById("cotizacion_descripcion").value =
            cotizacion.descripcion || "";

        document.getElementById("cotizacion_total").value =
            cotizacion.total || 0;

        document.getElementById("cotizacion_estado").value =
            cotizacion.estado || "Borrador";

        document.getElementById("titulo-formulario-cotizacion").textContent =
            "Actualizar información de la cotización";

        document.getElementById("boton-guardar-cotizacion").textContent =
            "Guardar cambios";

        document.getElementById("boton-cancelar-cotizacion").hidden = false;

        document.getElementById("formulario-cotizacion")
            .scrollIntoView({ behavior: "smooth" });

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}
// ========================================
// ELIMINAR COTIZACIONES
// ========================================

async function eliminarCotizacion(id) {

    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar esta cotización?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/cotizaciones/${encodeURIComponent(id)}`,
            { method: "DELETE" }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo eliminar la cotización."
            );
        }

        mostrarMensaje(resultado.mensaje, "success");

        await cargarCotizaciones();

    } catch (error) {

        mostrarMensaje(error.message, "danger");

    }
}
// ========================================
// GESTIONAR BOTONES DE LA TABLA DE COTIZACIONES
// ========================================

function gestionarAccionesCotizacion(event) {

    const boton = event.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "editar") {
        editarCotizacion(id);
    }

    if (accion === "eliminar") {
        eliminarCotizacion(id);
    }
}
// ========================================
// CANCELAR EDICIÓN DE COTIZACIONES
// ========================================

function cancelarEdicionCotizacion() {

    document.getElementById("formulario-cotizacion").reset();

    document.getElementById("id_cotizacion").value = "";

    document.getElementById("titulo-formulario-cotizacion").textContent =
        "Registrar nueva cotización";

    document.getElementById("boton-guardar-cotizacion").textContent =
        "Registrar cotización";

    document.getElementById("boton-cancelar-cotizacion").hidden = true;
}


// ========================================
// PREPARAR MÓDULO MATERIALES
// ========================================

function prepararModuloMateriales() {

    const contenedor = document.getElementById("contenido-materiales");

    contenedor.innerHTML = `

        <div class="info-card mb-4">

            <h4 id="titulo-formulario-material">Registrar nuevo material</h4>

            <form id="formulario-material">

                <input type="hidden" id="id_material">

                <div class="row g-3">

                    <div class="col-md-6">
                        <label class="form-label">Nombre del material *</label>
                        <input type="text" id="material_nombre"
                            class="form-control"
                            placeholder="Ej. Cemento gris" required>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Unidad de medida *</label>
                        <select id="material_unidad" class="form-select" required>
                            <option value="">Seleccionar unidad...</option>
                            <option value="Unidad">Unidad</option>
                            <option value="Bulto">Bulto</option>
                            <option value="Kilogramo">Kilogramo</option>
                            <option value="Metro">Metro</option>
                            <option value="Metro cuadrado">Metro cuadrado</option>
                            <option value="Metro cúbico">Metro cúbico</option>
                            <option value="Litro">Litro</option>
                            <option value="Galón">Galón</option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Cantidad disponible</label>
                        <input type="number" id="material_cantidad"
                            class="form-control"
                            placeholder="Cantidad en inventario"
                            min="0" step="0.01" value="0">
                    </div>

                    <div class="col-md-6">
                        <label class="form-label">Precio unitario</label>
                        <input type="number" id="material_precio"
                            class="form-control"
                            placeholder="Precio por unidad"
                            min="0" step="0.01" value="0">
                    </div>

                    <div class="col-12">
                        <label class="form-label">Descripción</label>
                        <textarea id="material_descripcion"
                            class="form-control" rows="3"
                            placeholder="Describe las características del material"></textarea>
                    </div>

                </div>

                <div class="mt-4">

                    <button type="submit" class="btn btn-primary"
                        id="boton-guardar-material">
                        Registrar material
                    </button>

                    <button type="button" class="btn btn-secondary"
                        id="boton-cancelar-material" hidden>
                        Cancelar edición
                    </button>

                </div>

            </form>

        </div>

        <div class="info-card">

            <h4>Materiales registrados</h4>

            <div class="table-responsive mt-3">

                <table class="table table-hover align-middle">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Material</th>
                            <th>Descripción</th>
                            <th>Unidad</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-materiales">
                        <tr>
                            <td colspan="7">Cargando materiales...</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </div>

    `;

    document.getElementById("formulario-material")
        .addEventListener("submit", guardarMaterial);

    document.getElementById("boton-cancelar-material")
        .addEventListener("click", cancelarEdicionMaterial);

    document.getElementById("tabla-materiales")
        .addEventListener("click", gestionarAccionesMaterial);

}
// ========================================
// CONSULTAR MATERIALES
// ========================================

async function cargarMateriales() {

    const tabla = document.getElementById("tabla-materiales");

    try {

        const respuesta = await fetch(`${API_URL}/materiales`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar los materiales.");
        }

        const materiales = await respuesta.json();

        tabla.innerHTML = "";

        document.getElementById("total-materiales").textContent =
            materiales.length;

        if (materiales.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7">No hay materiales registrados.</td>
                </tr>
            `;
            return;
        }

        materiales.forEach(material => {
            tabla.innerHTML += `
                <tr>
                    <td>${escaparHTML(material.id_material)}</td>
                    <td>${escaparHTML(material.nombre)}</td>
                    <td>${escaparHTML(material.descripcion || "Sin descripción")}</td>
                    <td>${escaparHTML(material.unidad)}</td>
                    <td>${Number(material.cantidad || 0).toLocaleString("es-CO")}</td>
                    <td>$ ${Number(material.precio_unitario || 0).toLocaleString("es-CO")}</td>
                    <td>
                        <button class="btn btn-sm btn-warning"
                            data-accion="editar"
                            data-id="${escaparHTML(material.id_material)}">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger"
                            data-accion="eliminar"
                            data-id="${escaparHTML(material.id_material)}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
        tabla.innerHTML = `
            <tr>
                <td colspan="7">Error al cargar los materiales.</td>
            </tr>
        `;
        mostrarMensaje("No se pudieron consultar los materiales.", "danger");
    }
}
// ========================================
// REGISTRAR Y ACTUALIZAR MATERIALES
// ========================================

async function guardarMaterial(event) {

    event.preventDefault();

    const id = document.getElementById("id_material").value;

    const material = {
        nombre: document.getElementById("material_nombre").value.trim(),
        descripcion: document.getElementById("material_descripcion").value.trim(),
        unidad: document.getElementById("material_unidad").value,
        cantidad: Number(document.getElementById("material_cantidad").value) || 0,
        precio_unitario: Number(document.getElementById("material_precio").value) || 0
    };

    if (!material.nombre || !material.unidad) {
        mostrarMensaje("El nombre y la unidad son obligatorios.", "warning");
        return;
    }

    try {

        const respuesta = await fetch(
            id ? `${API_URL}/materiales/${id}` : `${API_URL}/materiales`,
            {
                method: id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(material)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No fue posible guardar el material.");
        }

        mostrarMensaje(
            resultado.mensaje || "Material guardado correctamente.",
            "success"
        );

        cancelarEdicionMaterial();
        cargarMateriales();

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, "danger");
    }
}
// ========================================
// EDITAR MATERIAL
// ========================================

async function editarMaterial(id) {

    try {

        const respuesta = await fetch(`${API_URL}/materiales/${id}`);

        if (!respuesta.ok) {
            throw new Error("No fue posible consultar el material.");
        }

        const material = await respuesta.json();

        document.getElementById("id_material").value = material.id_material;
        document.getElementById("material_nombre").value = material.nombre;
        document.getElementById("material_descripcion").value = material.descripcion || "";
        document.getElementById("material_unidad").value = material.unidad;
        document.getElementById("material_cantidad").value = material.cantidad;
        document.getElementById("material_precio").value = material.precio_unitario;

        document.getElementById("titulo-formulario-material").textContent =
            "Actualizar información del material";

        document.getElementById("boton-guardar-material").textContent =
            "Guardar cambios";

        document.getElementById("boton-cancelar-material").hidden = false;

        document.getElementById("formulario-material").scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo cargar la información del material.", "danger");
    }
}
// ========================================
// ELIMINAR MATERIAL
// ========================================

async function eliminarMaterial(id) {

    const confirmar = confirm(
        "¿Estás seguro de que deseas eliminar este material?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(`${API_URL}/materiales/${id}`, {
            method: "DELETE"
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No fue posible eliminar el material.");
        }

        mostrarMensaje(
            resultado.mensaje || "Material eliminado correctamente.",
            "success"
        );

        cargarMateriales();

    } catch (error) {
        console.error(error);
        mostrarMensaje(error.message, "danger");
    }
}
// ========================================
// GESTIONAR ACCIONES DE MATERIALES
// ========================================

function gestionarAccionesMaterial(event) {

    const boton = event.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    if (accion === "editar") {
        editarMaterial(id);
    }

    if (accion === "eliminar") {
        eliminarMaterial(id);
    }
}
// ========================================
// CANCELAR EDICIÓN DE MATERIAL
// ========================================

function cancelarEdicionMaterial() {

    document.getElementById("formulario-material").reset();

    document.getElementById("id_material").value = "";

    document.getElementById("titulo-formulario-material").textContent =
        "Registrar nuevo material";

    document.getElementById("boton-guardar-material").textContent =
        "Registrar material";

    document.getElementById("boton-cancelar-material").hidden = true;
}