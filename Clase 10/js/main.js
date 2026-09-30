const API_URL = "https://api.openf1.org/v1/car_data?driver_number=55&session_key=9159&speed>=315";

let datosCargados = false;

document.addEventListener("DOMContentLoaded", () => {
    const loadApiBtn = document.getElementById("load-api-btn");
    const loader = document.getElementById("loader");
    const container = document.getElementById("telemetry-container");
    const checkStatusBtn = document.getElementById("check-status-btn");
    const applyFiltersBtn = document.getElementById("apply-filters-btn");
    const filterResults = document.getElementById("filter-results");

    const cargarApiOpenF1 = async () => {
        loader.style.display = "block";
        container.innerHTML = "";

        try {
            const respuesta = await fetch(API_URL);

            if (!respuesta.ok) {
                throw new Error("No se pudo conectar con la API de OpenF1");
            }

            const datos = await respuesta.json();

            datosCargados = true;
            renderizarEnDOM(datos.slice(0, 3), container);

            Toastify({
                text: "Datos de la API cargados con éxito",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
            }).showToast();

        } catch (error) {
            console.error("Hubo un error:", error);
            datosCargados = false;

            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error',
                text: 'No se pudieron cargar los datos de la API.',
                confirmButtonColor: '#e10600'
            });
        } finally {
            loader.style.display = "none";
        }
    };

    loadApiBtn.addEventListener("click", () => {
        cargarApiOpenF1();
    });

    checkStatusBtn.addEventListener("click", () => {
        if (datosCargados === false) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'La información de la API todavía no está disponible o no ha sido cargada.',
                confirmButtonColor: '#e10600'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Perfecto',
                text: 'La API ya está cargada y funcionando en el sistema.',
                confirmButtonColor: '#00b09b'
            });
        }
    });

    applyFiltersBtn.addEventListener("click", async () => {
        const yearSeleccionado = document.getElementById("year-select").value;
        const carreraSeleccionada = document.getElementById("race-select").value;

        if (!datosCargados) {
            Swal.fire({
                icon: 'error',
                title: 'Acción bloqueada',
                text: 'Debes cargar la API primero antes de consultar los resultados.',
                confirmButtonColor: '#e10600'
            });
            return;
        }

        if (yearSeleccionado === "" || carreraSeleccionada === "") {
            Toastify({
                text: "Por favor selecciona un año y una carrera",
                duration: 2500,
                gravity: "top",
                position: "right",
                style: { background: "#f39c12" }
            }).showToast();
            return;
        }

        try {
            const respClima = await fetch("https://api.openf1.org/v1/weather?session_key=9159");
            const datosClima = await respClima.json();
            
            let temperatura = "28°C (Soleado)";
            if (datosClima.length > 0) {
                const ultimo = datosClima[datosClima.length - 1];
                temperatura = `Pista: ${ultimo.track_temperature}°C | Aire: ${ultimo.air_temperature}°C`;
            }

            let ganador = "Max Verstappen (Red Bull)";
            if (carreraSeleccionada === "monaco") ganador = "Charles Leclerc (Ferrari)";
            if (carreraSeleccionada === "monza") ganador = "Oscar Piastri (McLaren)";

            filterResults.style.display = "block";
            filterResults.innerHTML = `
                <strong>Resultados para el GP (${yearSeleccionado}):</strong><br>
                Ganador: ${ganador}<br>
                Clima: ${temperatura}
            `;

            Toastify({
                text: "Consulta realizada con éxito",
                duration: 2500,
                gravity: "top",
                position: "right",
                style: { background: "#00b09b" }
            }).showToast();

        } catch (error) {
            console.log("Error al consultar el clima", error);
        }
    });
});

const renderizarEnDOM = (listaRegistros, elementoDestino) => {
    elementoDestino.innerHTML = "<h4>Registros recientes de Telemetría:</h4>";
    
    listaRegistros.forEach((item, index) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("result-card");
        tarjeta.style.margin = "10px 0";
        tarjeta.style.padding = "10px";
        tarjeta.style.background = "#2a2a2a";
        tarjeta.style.color = "#fff";
        
        tarjeta.innerHTML = `
            <p><strong>Registro #${index + 1}</strong></p>
            <p>Velocidad: ${item.speed} km/h — RPM: ${item.rpm}</p>
        `;
        
        elementoDestino.appendChild(tarjeta);
    });
};