const cortesDeCarne = [
  { id: 1, nombre: "Asado de Tira", precioPorKilo: 12000, stockKilos: 8 },
  { id: 2, nombre: "Vacio", precioPorKilo: 13500, stockKilos: 5 },
  { id: 3, nombre: "Bife de Chorizo", precioPorKilo: 14500, stockKilos: 10 },
  { id: 4, nombre: "Entraña", precioPorKilo: 15000, stockKilos: 4 },
  { id: 5, nombre: "Lomo", precioPorKilo: 14800, stockKilos: 6 },
  { id: 6, nombre: "Osobuco", precioPorKilo: 8000, stockKilos: 9 },
  { id: 7, nombre: "Matambre", precioPorKilo: 11000, stockKilos: 7 },
  { id: 8, nombre: "Roast Beef", precioPorKilo: 9500, stockKilos: 10 },
  { id: 9, nombre: "Tapa de Asado", precioPorKilo: 10500, stockKilos: 3 },
  { id: 10, nombre: "Colita de Cuadril", precioPorKilo: 13000, stockKilos: 5 }
];

let carrito = [];

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
          <input type="number" id="nuevo-precio" placeholder="Precio ($8000-$15000)">
          <input type="number" id="nuevo-stock" placeholder="Stock (1-10 kg)">
          <button id="btn-agregar-corte" class="btn">Agregar Corte</button>
        </div>
      </section>

      <section class="tarjeta-panel">
        <label for="input-buscar">Buscar corte:</label>
        <input type="text" id="input-buscar" placeholder="Escribí para filtrar...">
      </section>

      <section>
        <h2>Nuestros Cortes Disponibles</h2>
        <div id="contenedor-cortes" class="grid-cortes"></div>
      </section>

      <section class="tarjeta-panel">
        <h2>Resumen de Compra</h2>
        <ul id="lista-carrito">
          <li>Todavía no agregaste cortes a tu compra.</li>
        </ul>
        <hr>
        <div class="total-box">
          <h3>Total a pagar: $<span id="total-pagar">0</span></h3>
          <button id="btn-finalizar" class="btn">Finalizar Compra</button>
        </div>
      </section>
    </main>
  `;

  // Identificación de cliente
  document.getElementById("btn-ingresar").addEventListener("click", () => {
    const inputNombre = document.getElementById("input-nombre");
    const saludoUsuario = document.getElementById("saludo-usuario");
    const nombre = inputNombre.value.trim();

    if (nombre !== "") {
      saludoUsuario.textContent = `Hola ${nombre}, ¡bienvenido a nuestra tienda!`;
      mostrarFeedback(`¡Hola ${nombre}! Ya podés seleccionar tus cortes.`);
      inputNombre.value = "";
    } else {
      mostrarFeedback("Por favor, ingresá un nombre válido.");
    }
  });

  // Evento: Agregar un nuevo producto al array
  document.getElementById("btn-agregar-corte").addEventListener("click", () => {
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const precio = parseInt(document.getElementById("nuevo-precio").value);
    const stock = parseInt(document.getElementById("nuevo-stock").value);

    if (!nombre || isNaN(precio) || isNaN(stock) || precio <= 0 || stock <= 0) {
      mostrarFeedback("Completá todos los campos correctamente.");
      return;
    }

    const nuevoCorte = {
      id: cortesDeCarne.length + 1,
      nombre: nombre,
      precioPorKilo: precio,
      stockKilos: stock
    };

    cortesDeCarne.push(nuevoCorte);
    renderizarCortes();
    mostrarFeedback(`Corte "${nombre}" agregado con éxito al catálogo.`);

    document.getElementById("nuevo-nombre").value = "";
    document.getElementById("nuevo-precio").value = "";
    document.getElementById("nuevo-stock").value = "";
  });

  // Evento de Teclado: Filtro
  document.getElementById("input-buscar").addEventListener("keyup", (e) => {
    const texto = e.target.value.toLowerCase().trim();
    const filtrados = cortesDeCarne.filter((c) => c.nombre.toLowerCase().includes(texto));
    renderizarCortes(filtrados);
  });

  // Finalizar Compra
  document.getElementById("btn-finalizar").addEventListener("click", () => {
    if (carrito.length === 0) {
      mostrarFeedback("El carrito está vacío.");
      return;
    }
    mostrarFeedback("¡Gracias por tu compra en Tienda Gabriel!");
    carrito = [];
    actualizarCarrito();
  });

  renderizarCortes();
});

function mostrarFeedback(mensaje) {
  const mensajeFeedback = document.getElementById("mensaje-feedback");
  if (!mensajeFeedback) return;
  
  mensajeFeedback.textContent = mensaje;
  mensajeFeedback.className = "feedback visible";

  setTimeout(() => {
    mensajeFeedback.className = "feedback oculto";
  }, 3500);
}

function renderizarCortes(lista = cortesDeCarne) {
  const contenedorCortes = document.getElementById("contenedor-cortes");
  if (!contenedorCortes) return;

  if (lista.length === 0) {
    contenedorCortes.innerHTML = "<p>No se encontraron cortes disponibles.</p>";
    return;
  }

  let htmlTarjetas = "";

  lista.forEach((corte) => {
    htmlTarjetas += `
      <div class="tarjeta-corte">
        <h3>${corte.nombre}</h3>
        <p>Precio por kg: <strong>$${corte.precioPorKilo.toLocaleString()}</strong></p>
        <p>Stock disponible: <strong>${corte.stockKilos} kg</strong></p>
        
        <div class="comprar-box">
          <label>Kilos a comprar:</label>
          <input type="number" id="kilos-${corte.id}" min="1" max="${corte.stockKilos}" value="1">
          <button class="btn" onclick="comprarCorte(${corte.id})">Comprar</button>
        </div>
      </div>
    `;
  });

  contenedorCortes.innerHTML = htmlTarjetas;
}

function comprarCorte(id) {
  const corte = cortesDeCarne.find((item) => item.id === id);
  const inputKilos = document.getElementById(`kilos-${id}`);
  const kilos = parseInt(inputKilos.value);

  if (isNaN(kilos) || kilos <= 0) {
    mostrarFeedback("Ingresá una cantidad de kilos válida.");
    return;
  }

  if (kilos > corte.stockKilos) {
    mostrarFeedback(`No podés comprar más del stock disponible (${corte.stockKilos} kg).`);
    return;
  }

  corte.stockKilos -= kilos;
  const subtotal = corte.precioPorKilo * kilos;

  carrito.push({
    nombre: corte.nombre,
    kilos: kilos,
    subtotal: subtotal
  });

  renderizarCortes();
  actualizarCarrito();
  mostrarFeedback(`Agregaste ${kilos} kg de ${corte.nombre} al carrito.`);
}

function actualizarCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalPagar = document.getElementById("total-pagar");

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>Todavía no agregaste cortes a tu compra.</li>";
    totalPagar.textContent = "0";
    return;
  }

  let htmlCarrito = "";
  let total = 0;

  carrito.forEach((item) => {
    htmlCarrito += `<li>${item.nombre} — ${item.kilos} kg = $${item.subtotal.toLocaleString()}</li>`;
    total += item.subtotal;
  });

  listaCarrito.innerHTML = htmlCarrito;
  totalPagar.textContent = total.toLocaleString();
}