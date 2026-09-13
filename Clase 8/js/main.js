// 1. Datos iniciales y lectura de localStorage con operador (??)
const cortesIniciales = [
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

// Si existen datos en localStorage los usa, si no, usa el array inicial (??)
let cortesDeCarne = JSON.parse(localStorage.getItem("cortes")) ?? cortesIniciales;
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <header>
      <h1>Tienda de Carnes Gabriel</h1>
      <h2 id="saludo-usuario" class="saludo">Hola, ¡Bienvenido!</h2>
    </header>

    <main class="contenedor-principal">
      <section class="tarjeta-panel">
        <h3>Identificación del Cliente</h3>
        <div class="formulario-ingreso">
          <input type="text" id="input-nombre" placeholder="Ingresá tu nombre...">
          <button id="btn-ingresar" class="btn">Ingresar</button>
        </div>
        <div id="mensaje-feedback" class="feedback oculto"></div>
      </section>

      <section class="tarjeta-panel">
        <h3>Agregar Nuevo Corte al Catálogo</h3>
        <div class="formulario-ingreso">
          <input type="text" id="nuevo-nombre" placeholder="Nombre (ej: Peceto)">
          <input type="number" id="nuevo-precio" placeholder="Precio">
          <input type="number" id="nuevo-stock" placeholder="Stock">
          <button id="btn-agregar" class="btn">Agregar Corte</button>
        </div>
      </section>

      <section class="tarjeta-panel">
        <label>Buscar corte:</label>
        <input type="text" id="input-buscar" placeholder="Escribí para filtrar...">
      </section>

      <section>
        <h2>Nuestros Cortes Disponibles</h2>
        <div id="contenedor-cortes" class="grid-cortes"></div>
      </section>

      <section class="tarjeta-panel">
        <h2>Resumen de Compra</h2>
        <ul id="lista-carrito"></ul>
        <hr>
        <div class="total-box">
          <h3>Total a pagar: $<span id="total-pagar">0</span></h3>
          <button id="btn-finalizar" class="btn">Finalizar Compra</button>
        </div>
      </section>
    </main>
  `;

  // Evento: Nombre del Cliente
  document.getElementById("btn-ingresar").addEventListener("click", () => {
    const nombre = document.getElementById("input-nombre").value.trim();
    
    // Uso de Operador Ternario para cumplir con la consigna
    nombre !== "" 
      ? (document.getElementById("saludo-usuario").textContent = `Hola ${nombre}, ¡bienvenido!`, mostrarFeedback(`¡Hola ${nombre}!`))
      : mostrarFeedback("Ingresá un nombre válido.");
  });

  // Evento: Agregar Nuevo Corte
  document.getElementById("btn-agregar").addEventListener("click", () => {
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const precio = parseInt(document.getElementById("nuevo-precio").value);
    const stock = parseInt(document.getElementById("nuevo-stock").value);

    if (nombre !== "" && precio > 0 && stock > 0) {
      const nuevoCorte = {
        id: cortesDeCarne.length + 1,
        nombre: nombre,
        precio: precio,
        stock: stock
      };

      cortesDeCarne.push(nuevoCorte);
      localStorage.setItem("cortes", JSON.stringify(cortesDeCarne));
      renderizarCortes();
      mostrarFeedback(`Corte "${nombre}" agregado al catálogo.`);

      document.getElementById("nuevo-nombre").value = "";
      document.getElementById("nuevo-precio").value = "";
      document.getElementById("nuevo-stock").value = "";
    } else {
      mostrarFeedback("Por favor, completá todos los campos.");
    }
  });

  // Evento de Teclado: Filtro de búsqueda
  document.getElementById("input-buscar").addEventListener("keyup", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = cortesDeCarne.filter(corte => corte.nombre.toLowerCase().includes(texto));
    renderizarCortes(filtrados);
  });

  // Evento: Finalizar Compra
  document.getElementById("btn-finalizar").addEventListener("click", () => {
    if (carrito.length === 0) {
      mostrarFeedback("El carrito está vacío.");
    } else {
      mostrarFeedback("¡Gracias por tu compra en Tienda Gabriel!");
      carrito = [];
      localStorage.removeItem("carrito");
      actualizarCarrito();
    }
  });

  renderizarCortes();
  actualizarCarrito();
});

// Función de Feedback Visual
function mostrarFeedback(mensaje) {
  const el = document.getElementById("mensaje-feedback");
  if (!el) return;
  el.textContent = mensaje;
  el.className = "feedback visible";
  setTimeout(() => {
    el.className = "feedback oculto";
  }, 3000);
}

// Renderizado de cortes utilizando forEach y DESTRUCTURING
function renderizarCortes(lista = cortesDeCarne) {
  const contenedor = document.getElementById("contenedor-cortes");
  if (!contenedor) return;

  let html = "";

  lista.forEach((corte) => {
    // Aplicación de Destructuring (Consigna)
    const { id, nombre, precio, stock } = corte;

    html += `
      <div class="tarjeta-corte">
        <h3>${nombre}</h3>
        <p>Precio kg: <strong>$${precio}</strong></p>
        <p>Stock disponible: <strong>${stock} kg</strong></p>
        <div class="comprar-box">
          <button class="btn" onclick="comprarCorte(${id})">Comprar 1kg</button>
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

// Función para Comprar
function comprarCorte(id) {
  const corte = cortesDeCarne.find(item => item.id === id);

  if (!corte || corte.stock <= 0) {
    mostrarFeedback("No hay stock suficiente.");
    return;
  }

  corte.stock = corte.stock - 1;

  carrito.push({
    nombre: corte.nombre,
    precio: corte.precio
  });

  // Sincronización en localStorage
  localStorage.setItem("cortes", JSON.stringify(cortesDeCarne));
  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderizarCortes();
  actualizarCarrito();
  mostrarFeedback(`Agregaste 1kg de ${corte.nombre} al carrito.`);
}

// Actualizar Carrito usando forEach y DESTRUCTURING
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalEl = document.getElementById("total-pagar");

  if (carrito.length === 0) {
    lista.innerHTML = "<li>El carrito está vacío.</li>";
    totalEl.textContent = "0";
    return;
  }

  let htmlCarrito = "";
  let total = 0;

  carrito.forEach((item, index) => {
    // Aplicación de Destructuring (Consigna)
    const { nombre, precio } = item;

    htmlCarrito += `
      <li>
        ${nombre} — $${precio} 
        <button class="btn" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </li>
    `;
    total = total + precio;
  });

  lista.innerHTML = htmlCarrito;
  totalEl.textContent = total;
}

// Eliminar ítem del Carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
  mostrarFeedback("Producto eliminado del carrito.");
}