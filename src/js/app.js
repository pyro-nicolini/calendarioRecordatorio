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
  }

  function mostrarRecordatorios() {
    const lista = document.getElementById("lista-recordatorios");
    lista.innerHTML = "";
    year2025.forEach((mes) => {
      mes.dias.forEach((dia) => {
        if (dia.recordatorios.length > 0) {
          const item = document.createElement("div");
          item.className = "recordatorio";
          item.textContent = `Día ${dia.numeroDia} de ${mes.mes}: ${dia.recordatorios.join(", ")}`;
          lista.appendChild(item);
        }
      });
    });
  }

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
        guardarEnLocalStorage(year2025);
        mostrarRecordatorios();
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
  }

  document.getElementById("borrar").addEventListener("click", () => {
    const mes = parseInt(document.getElementById("mes").value);
    const dia = parseInt(document.getElementById("dia").value);
    const tarea = document.getElementById("recordatorio").value;
        borrarRecordatorio(mes, dia);
  });