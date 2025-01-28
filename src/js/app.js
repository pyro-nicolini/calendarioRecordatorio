let year2025 = [
    { mes: "Enero", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Febrero", dias: Array.from({ length: 28 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Marzo", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Abril", dias: Array.from({ length: 30 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Mayo", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Junio", dias: Array.from({ length: 30 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Julio", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Agosto", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Septiembre", dias: Array.from({ length: 30 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Octubre", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Noviembre", dias: Array.from({ length: 30 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
    { mes: "Diciembre", dias: Array.from({ length: 31 }, (_, i) => ({ numeroDia: i + 1, recordatorios: [] })) },
  ];

  function mostrarCalendarioMes(mesIndex) {
    const contenedorCalendario = document.querySelector(".calendario");
    contenedorCalendario.innerHTML = ""; // Limpiar el calendario actual
    const mes = year2025[mesIndex];
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const primerDiaSemana = diasSemana.indexOf(mes.dias[0].nombreDia);
    
    // Agregar elementos vacíos para los días anteriores al primer día del meswww
    for (let i = 0; i < primerDiaSemana; i++) {
      const diaVacio = document.createElement("div");
      diaVacio.className = "box empty";
      contenedorCalendario.appendChild(diaVacio);
    }
    
    // Agregar los días del mes con su contenido
    mes.dias.forEach((dia, diaIndex) => {
      const diaElemento = document.createElement("div");
      const diaElementoBox = document.createElement("div");
      diaElementoBox.className = "box-day";
      diaElementoBox.innerHTML = `${dia.numeroDia} (${dia.nombreDia})`;
      if (dia.nombreDia == 'Domingo') {
        diaElemento.className = "box domingo";
      } else {
        diaElemento.className = "box";
      }
      diaElemento.innerHTML = `
      ${dia.recordatorios
        .map(
          (rec, recIndex) =>
            `<li>${rec} <a style='cursor: pointer; color: red' onclick='borrarEsteRecordatorio(${mesIndex}, ${diaIndex}, ${recIndex})'>X</a></li>`
        )
        .join(" ")}
        `;
      if (dia.recordatorios.length > 0) {
        diaElemento.classList.add("recordar");
      }
      diaElementoBox.appendChild(diaElemento);
      contenedorCalendario.appendChild(diaElementoBox);
      diaElemento.setAttribute("data-recordatorios", dia.recordatorios.join(", "));
    });
  }
  
  function borrarEsteRecordatorio(mesIndex, diaIndex, recIndex) {
    year2025[mesIndex].dias[diaIndex].recordatorios.splice(recIndex, 1); // Elimina el recordatorio
    guardarEnLocalStorage(year2025); // Guarda los cambios
    mostrarCalendarioMes(mesIndex); // Actualiza el calendario del mes actual
    mostrarRecordatorios();
    mostrarCalendarioMes(0);
  }

  function cargarDesdeLocalStorage() {
    const data = localStorage.getItem("calendario2025");
    return data ? JSON.parse(data) : year2025;
  }
  
  function guardarEnLocalStorage(data) {
    localStorage.setItem("calendario2025", JSON.stringify(data));
  }

  function agregarRecordatorio(mes, dia, tarea) {
    const mesObj = year2025[mes];
    const diaObj = mesObj.dias[dia - 1];
    diaObj.recordatorios.push(tarea);
    guardarEnLocalStorage(year2025); // 
    mostrarRecordatorios();
    mostrarCalendarioMes(0);
  }

  function mostrarRecordatorios() {
    const lista = document.getElementById("lista-recordatorios");
    lista.innerHTML = "";
    year2025.forEach((mes, mesIndex) => {
      mes.dias.forEach((dia, diaIndex) => {
        if (dia.recordatorios.length > 0) {
          const item = document.createElement("li");
          item.className = "recordatorio";
          item.textContent = `Día ${dia.numeroDia} de ${mes.mes}: ${dia.recordatorios.join(", ")} `;
          const link = document.createElement("a");
          link.textContent = "X";
          link.style.cursor = "pointer";
          link.style.color = "red";
          link.onclick = () => borrarEsteRecordatorio(mesIndex, diaIndex, dia.recordatorios.length - 1);
          item.appendChild(link);
          lista.appendChild(item);
        }
      });
    });
  }

// Función para calcular los días de la semana para un año dado
function asignarDiasSemana(año, yearData) {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  yearData.forEach((mes, index) => {
    mes.dias.forEach((dia) => {
      const fecha = new Date(año, index, dia.numeroDia);
      dia.nombreDia = diasSemana[fecha.getDay()]; // Asignar el día de la semana
    });
  });
}

// Llamada inicial para 2025
asignarDiasSemana(2025, year2025);
guardarEnLocalStorage(year2025);

// Evento para cambiar el mes desde el selector
document.getElementById("elegirMes").addEventListener("change", (e) => {
  const mesSeleccionado = parseInt(e.target.value);
  mostrarCalendarioMes(mesSeleccionado);
});

// Mostrar el primer mes por defecto
mostrarCalendarioMes(0);

  function exportarDatos() {
    const data = JSON.stringify(year2025, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendario2025.json";
    link.click();
  }

  function importarDatos(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        year2025 = JSON.parse(reader.result);
        asignarDiasSemana(2025, year2025); // Recalcular los días de la semana
        guardarEnLocalStorage(year2025);
        mostrarRecordatorios();
        mostrarCalendarioMes(0); // Renderizar el calendario del mes actual después de importar
        alert("Datos importados correctamente.");
      } catch (error) {
        alert("Error al importar el archivo. Asegúrate de que sea un archivo JSON válido.");
      }
    };
    reader.readAsText(file);
  }
  
  document.getElementById("agregar").addEventListener("click", () => {
    const mes = parseInt(document.getElementById("mes").value);
    const dia = parseInt(document.getElementById("dia").value);
    const tarea = document.getElementById("recordatorio").value;
  
    if (mes >= 0 && dia > 0 && dia <= year2025[mes].dias.length && tarea.trim() !== "") {
      agregarRecordatorio(mes, dia, tarea);
      document.getElementById("dia").value = "";
      document.getElementById("recordatorio").value = "";
    } else {
      alert("Por favor, introduce datos válidos.");
    }
  });

  document.getElementById("exportar").addEventListener("click", exportarDatos);
  
  document.getElementById("importarJSON").addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      importarDatos(e.target.files[0]);
    } else {
      alert("Por favor selecciona un archivo.");
    }
  });
  
  year2025 = cargarDesdeLocalStorage();
  mostrarRecordatorios();

  function borrarRecordatorio(mes, dia) {
    const mesObj = year2025[mes];
    const diaObj = mesObj.dias[dia - 1];
    diaObj.recordatorios.pop();
    guardarEnLocalStorage(year2025);
    mostrarRecordatorios();
    mostrarCalendarioMes(0);
  }

  document.getElementById("borrar").addEventListener("click", () => {
    const mes = parseInt(document.getElementById("mes").value);
    const dia = parseInt(document.getElementById("dia").value);
    const tarea = document.getElementById("recordatorio").value;
        borrarRecordatorio(mes, dia);
  });