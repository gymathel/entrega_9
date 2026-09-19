// Array inicial por si el LocalStorage está vacío
const productosIniciales = [
  { id: 1, nombre: "Asado de Tira", precio: 12000, stock: 8 },
  { id: 2, nombre: "Vacio", precio: 13500, stock: 5 },
  { id: 3, nombre: "Bife de Chorizo", precio: 14500, stock: 10 },
  { id: 4, nombre: "Entraña", precio: 15000, stock: 4 },
  { id: 5, nombre: "Lomo", precio: 14800, stock: 6 },
  { id: 6, nombre: "Osobuco", precio: 8000, stock: 9 },
  { id: 7, nombre: "Matambre", precio: 11000, stock: 7 },
  { id: 8, nombre: "Roast Beef", precio: 9500, stock: 10 },
  { id: 9, nombre: "Tapa de Asado", precio: 10500, stock: 3 },
  { id: 10, nombre: "Colita de Cuadril", precio: 13000, stock: 5 }
];

let listaCortes = [];
let arrayCarrito = [];

// Cargar datos de localStorage al iniciar
try {
  let cortesEnStorage = localStorage.getItem("misCortes");
  let carritoEnStorage = localStorage.getItem("miCarrito");

  if (cortesEnStorage) {
    listaCortes = JSON.parse(cortesEnStorage);
  } else {
    listaCortes = productosIniciales;
  }

  if (carritoEnStorage) {
    arrayCarrito = JSON.parse(carritoEnStorage);
  } else {
    arrayCarrito = [];
  }
} catch (error) {
  console.log("Error al cargar localStorage, se usan datos por defecto.");
  listaCortes = productosIniciales;
  arrayCarrito = [];
}

// Guardar datos en Storage
function guardarDatos() {
  localStorage.setItem("misCortes", JSON.stringify(listaCortes));
  localStorage.setItem("miCarrito", JSON.stringify(arrayCarrito));
}

// Inicio del DOM
document.addEventListener("DOMContentLoaded", function () {
  let contenedorApp = document.getElementById("app");

  // Estructura HTML principal
  contenedorApp.innerHTML = `
    <header>
      <h1>Carnicería Gabriel</h1>
      <h2 id="saludo-cliente">¡Hola, bienvenido a la tienda!</h2>
    </header>

    <main>
      <div id="cartel-oferta" class="oculto"></div>

      <section class="caja-seccion">
        <h3>Tu Nombre</h3>
        <input type="text" id="nombre-usuario" placeholder="Escribí tu nombre">
        <button id="btn-saludar">Guardar Nombre</button>
        <p id="mensaje-alerta"></p>
      </section>

      <section class="caja-seccion">
        <h3>Agregar Corte al Catálogo</h3>
        <input type="text" id="nuevo-nombre" placeholder="Nombre">
        <input type="number" id="nuevo-precio" placeholder="Precio">
        <input type="number" id="nuevo-stock" placeholder="Stock">
        <button id="btn-crear">Agregar</button>
      </section>

      <section class="caja-seccion">
        <label>Buscar producto:</label>
        <input type="text" id="buscador" placeholder="Buscar...">
      </section>

      <section>
        <h2>Cortes en Venta</h2>
        <div id="grid-productos"></div>
      </section>

      <section class="caja-seccion">
        <h2>Mi Carrito</h2>
        <ul id="lista-de-compras"></ul>
        <hr>
        <h3>Total: $<span id="monto-total">0</span></h3>
        <button id="btn-comprar">Comprar Carrito</button>
        <button id="btn-limpiar">Vaciar Todo (Clear Storage)</button>
      </section>
    </main>
  `;

  // --- ASINCRONISMO: Cartel de oferta diferido (setTimeout) ---
  setTimeout(function () {
    let cartel = document.getElementById("cartel-oferta");
    if (cartel) {
      cartel.innerHTML = "<p><strong>🔔 Promoción del día:</strong> 10% de descuento abonando en efectivo.</p>";
      cartel.className = "cartel-visible";
    }
  }, 2000);

  // Saludo personalizado
  document.getElementById("btn-saludar").addEventListener("click", function () {
    let nombreIngresado = document.getElementById("nombre-usuario").value;

    if (nombreIngresado !== "") {
      document.getElementById("saludo-cliente").textContent = "¡Hola " + nombreIngresado + ", bienvenido!";
      mostrarMensaje("¡Hola " + nombreIngresado + "!");
    } else {
      mostrarMensaje("Por favor ingresá un nombre.");
    }
  });

  // --- MANEJO DE ERRORES: Agregar corte con try - catch - finally ---
  document.getElementById("btn-crear").addEventListener("click", function () {
    let inputNom = document.getElementById("nuevo-nombre");
    let inputPre = document.getElementById("nuevo-precio");
    let inputSto = document.getElementById("nuevo-stock");

    try {
      let nombre = inputNom.value.trim();
      let precio = parseFloat(inputPre.value);
      let stock = parseInt(inputSto.value);

      // Lanzamos un error voluntario si falta algún dato o los valores son inválidos
      if (nombre === "" || isNaN(precio) || isNaN(stock) || precio <= 0 || stock <= 0) {
        throw new Error("Formulario incompleto o datos erróneos");
      }

      let nuevoCorte = {
        id: Date.now(),
        nombre: nombre,
        precio: precio,
        stock: stock
      };

      listaCortes.push(nuevoCorte);
      guardarDatos();
      mostrarCortes(listaCortes);
      mostrarMensaje("Se agregó " + nombre + " al catálogo.");

    } catch (error) {
      // Captura el error y avisa al usuario
      mostrarMensaje("⚠️ No se pudo procesar la operación, intentá de nuevo.");
      console.warn("Detalle del error:", error.message);

    } finally {
      // El bloque finally se ejecuta SIEMPRE para limpiar los inputs
      inputNom.value = "";
      inputPre.value = "";
      inputSto.value = "";
    }
  });

  // Buscador
  document.getElementById("buscador").addEventListener("keyup", function (e) {
    let texto = e.target.value.toLowerCase();
    let resultado = listaCortes.filter(function (corte) {
      return corte.nombre.toLowerCase().includes(texto);
    });
    mostrarCortes(resultado);
  });

  // Finalizar compra
  document.getElementById("btn-comprar").addEventListener("click", function () {
    if (arrayCarrito.length === 0) {
      mostrarMensaje("El carrito está vacío.");
    } else {
      mostrarMensaje("¡Gracias por tu compra!");
      arrayCarrito = [];
      localStorage.removeItem("miCarrito");
      dibujarCarrito();
    }
  });

  // Vaciar Storage
  document.getElementById("btn-limpiar").addEventListener("click", function () {
    localStorage.clear();
    listaCortes = [...productosIniciales];
    arrayCarrito = [];
    guardarDatos();
    mostrarCortes(listaCortes);
    dibujarCarrito();
    mostrarMensaje("Se reseteó todo el almacenamiento.");
  });

  // Render inicial de datos
  mostrarCortes(listaCortes);
  dibujarCarrito();
});

// Función para alertas de usuario
function mostrarMensaje(texto) {
  let cartel = document.getElementById("mensaje-alerta");
  if (cartel) {
    cartel.textContent = texto;
    setTimeout(function () {
      cartel.textContent = "";
    }, 3000);
  }
}

// Dibujar tarjetas de cortes
function mostrarCortes(lista) {
  let contenedor = document.getElementById("grid-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  lista.forEach(function (corte) {
    let div = document.createElement("div");
    div.className = "tarjeta-corte";

    div.innerHTML = `
      <h3>${corte.nombre}</h3>
      <p>Precio por kg: $${corte.precio}</p>
      <p>Stock: ${corte.stock} kg</p>
      <button onclick="agregarAlCarrito(${corte.id})">Comprar 1kg</button>
      <br><br>
      <details>
        <summary>Editar corte</summary>
        <input type="text" id="edit-nom-${corte.id}" value="${corte.nombre}">
        <input type="number" id="edit-pre-${corte.id}" value="${corte.precio}">
        <button onclick="editarCorte(${corte.id})">Guardar</button>
      </details>
    `;

    contenedor.appendChild(div);
  });
}

// Editar datos de un corte
function editarCorte(idBuscado) {
  let corteEncontrado = listaCortes.find(function (c) {
    return c.id === idBuscado;
  });

  let nuevoNom = document.getElementById("edit-nom-" + idBuscado).value;
  let nuevoPre = parseFloat(document.getElementById("edit-pre-" + idBuscado).value);

  if (corteEncontrado && nuevoNom !== "" && !isNaN(nuevoPre)) {
    corteEncontrado.nombre = nuevoNom;
    corteEncontrado.precio = nuevoPre;

    guardarDatos();
    mostrarCortes(listaCortes);
    dibujarCarrito();
    mostrarMensaje("Corte editado correctamente.");
  } else {
    mostrarMensaje("Error al editar los datos.");
  }
}

// Carrito acumulable: agrega o incrementa cantidad
function agregarAlCarrito(idBuscado) {
  let corteEncontrado = listaCortes.find(function (c) {
    return c.id === idBuscado;
  });

  if (corteEncontrado) {
    if (corteEncontrado.stock > 0) {
      corteEncontrado.stock = corteEncontrado.stock - 1;

      let itemEnCarrito = arrayCarrito.find(function (item) {
        return item.idCorte === corteEncontrado.id;
      });

      if (itemEnCarrito) {
        itemEnCarrito.cantidad = itemEnCarrito.cantidad + 1;
      } else {
        arrayCarrito.push({
          idCorte: corteEncontrado.id,
          nombre: corteEncontrado.nombre,
          precio: corteEncontrado.precio,
          cantidad: 1
        });
      }

      guardarDatos();
      mostrarCortes(listaCortes);
      dibujarCarrito();
      mostrarMensaje("Agregaste 1kg de " + corteEncontrado.nombre);
    } else {
      mostrarMensaje("¡No queda más stock de este corte!");
    }
  }
}

// Dibujar lista del carrito y total
function dibujarCarrito() {
  let ulCarrito = document.getElementById("lista-de-compras");
  let spanTotal = document.getElementById("monto-total");

  if (arrayCarrito.length === 0) {
    ulCarrito.innerHTML = "<li>Tu carrito está vacío.</li>";
    spanTotal.textContent = "0";
    return;
  }

  ulCarrito.innerHTML = "";
  let totalSuma = 0;

  arrayCarrito.forEach(function (item, posicion) {
    let subtotal = item.precio * item.cantidad;

    let li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - $${subtotal} 
      <button onclick="quitarDelCarrito(${posicion})">X</button>
    `;
    ulCarrito.appendChild(li);

    totalSuma = totalSuma + subtotal;
  });

  spanTotal.textContent = totalSuma;
}

// Restar ítem del carrito y reponer stock
function quitarDelCarrito(posicion) {
  let itemQueBorro = arrayCarrito[posicion];

  if (itemQueBorro) {
    let corteOriginal = listaCortes.find(function (c) {
      return c.id === itemQueBorro.idCorte;
    });

    if (corteOriginal) {
      corteOriginal.stock = corteOriginal.stock + 1;
    }

    if (itemQueBorro.cantidad > 1) {
      itemQueBorro.cantidad = itemQueBorro.cantidad - 1;
    } else {
      arrayCarrito.splice(posicion, 1);
    }

    guardarDatos();
    mostrarCortes(listaCortes);
    dibujarCarrito();
    mostrarMensaje("Se devolvió 1kg al stock.");
  }
}