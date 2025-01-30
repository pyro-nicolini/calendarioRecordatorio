// Variables globales
let currentDate = new Date();
let reminders = {}; // Objeto para almacenar recordatorios por fecha
let selectedDay = null;

// Elementos del DOM
const currentMonthElem = document.getElementById("current-month");
const calendarGrid = document.getElementById("calendar-grid");
const reminderList = document.getElementById("reminders");
const addReminderButton = document.getElementById("add-reminder");
const reminderDateInput = document.getElementById("reminder-date");
const reminderTextInput = document.getElementById("reminder-text");
const exportButton = document.getElementById("export-reminders");
const importButton = document.getElementById("import-reminders");

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

// Función para obtener el nombre del día de la semana
function getDayName(date) {
  return daysOfWeek[date.getDay()];
}

// Función para crear una celda de día con su respectivo recordatorio
function createDayCell(year, month, day) {
  const dayCell = document.createElement("div");
  const currentDayDate = new Date(year, month, day);
  const dayName = getDayName(currentDayDate);
  const numberDia = document.createElement("div");
  numberDia.className = "donDia";
  numberDia.innerText = day;

  const nombreDia = document.createElement("p");
  nombreDia.innerHTML = dayName;
  nombreDia.className = "nombreDia";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderDate = new Date(year, month, day);
  reminderDate.setHours(0, 0, 0, 0);

  // Cambiar color según la fecha del recordatorio
  if (reminderDate < today) {
    dayCell.style.backgroundColor = "#ff9499"; // Pasado
  } else if (reminderDate.getTime() === today.getTime()) {
    dayCell.style.backgroundColor = "#fff293"; // Hoy
  } else {
    dayCell.style.backgroundColor = "#b5dc98"; // Futuro
  }

  numberDia.prepend(nombreDia);
  dayCell.appendChild(numberDia);
  dayCell.className = "day";
  dayCell.addEventListener("click", () => selectDay(dayCell, year, month, day));

  // Verificar si hay recordatorios para este día
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const dayReminders = reminders[dateString] || [];

  const masterBox = document.createElement("div");
  masterBox.className = "masterBox";

  if (dayReminders.length > 0) {
    dayReminders.forEach((reminder, index) => {
      const reminderDiv = document.createElement("div");
      reminderDiv.textContent = reminder.text;
      reminderDiv.className = "box";

      const deleteButton = document.createElement("a");
      deleteButton.textContent = "X";
      deleteButton.style.color = "red";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.marginLeft = "5px";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteReminder(dateString, index);
      });

      masterBox.appendChild(reminderDiv);
      reminderDiv.appendChild(deleteButton);
      dayCell.appendChild(masterBox);
    });
  }

  return dayCell;
}

// Función para actualizar el calendario
function updateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthElem.textContent = `${months[month]} ${year}`;
  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstDayOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  for (let i = 0; i < firstDayOffset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayCell = createDayCell(year, month, i);
    calendarGrid.appendChild(dayCell);
  }
}

// Función para seleccionar un día y destacarlo
function selectDay(dayCell, year, month, day) {
  if (selectedDay) {
    selectedDay.classList.remove("selected-day");
  }

  dayCell.classList.add("selected-day");
  selectedDay = dayCell;

  reminderDateInput.value = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  reminderTextInput.focus();
}

// Función para eliminar un recordatorio
function deleteReminder(dateString, index) {
  reminders[dateString].splice(index, 1);
  if (reminders[dateString].length === 0) {
    delete reminders[dateString];
  }
  updateCalendar();
  updateReminderList();
}

// Función para agregar un recordatorio
addReminderButton.addEventListener("click", () => {
  const date = reminderDateInput.value;
  const text = reminderTextInput.value;

  if (date && text) {
    if (!reminders[date]) {
      reminders[date] = [];
    }
    reminders[date].push({ date, text });
    updateCalendar();
    updateReminderList();
    reminderTextInput.value = "";
  }
});

// Función para actualizar la lista de recordatorios
function updateReminderList() {
  reminderList.innerHTML = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  Object.keys(reminders).sort().forEach(date => {
    const [year, month, day] = date.split("-").map(Number);
    const reminderDate = new Date(year, month - 1, day);
    reminderDate.setHours(0, 0, 0, 0);

    const dayName = getDayName(reminderDate);

    reminders[date].forEach((reminder, index) => {
      const li = document.createElement("li");
      li.textContent = `${dayName.substring(0, 3).toUpperCase()}, ${day}-${months[month - 1].substring(0, 3)}: ${reminder.text}`;

      if (reminderDate < today) {
        li.className = "pasado";
      } else if (reminderDate.getTime() === today.getTime()) {
        li.className = "presente";
      } else {
        li.className = "futuro";
      }

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.className = "eliminar";
      deleteButton.addEventListener("click", () => deleteReminder(date, index));

      li.appendChild(deleteButton);
      reminderList.appendChild(li);
    });
  });
}

// Función para exportar recordatorios
exportButton.addEventListener("click", () => {
  const dataStr = JSON.stringify(reminders);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'reminders.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
});

// Función para importar recordatorios
importButton.addEventListener("click", () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = readerEvent => {
      const content = readerEvent.target.result;
      reminders = JSON.parse(content);
      updateCalendar();
      updateReminderList();
    };
  };

  input.click();
});

// Función para cambiar de mes
document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

// Inicializamos el calendario
updateCalendar();



/*--------EJEMPLO DE COMO QUEDA GUARDADO----

{
  "2025-01-11": [
    { "date": "2025-01-11", "text": "asdasdasd" },
    { "date": "2025-01-11", "text": "adwdawdaw" },
    { "date": "2025-01-11", "text": "dawdawdaw" },
    { "date": "2025-01-11", "text": "dawdawd" }
  ],
  "2025-01-12": [
    { "date": "2025-01-12", "text": "adwdadsa" },
    { "date": "2025-01-12", "text": "dawdawdaw" }
  ],
  "2025-01-10": [{ "date": "2025-01-10", "text": "awdasdadw" }],
  "2025-01-30": [
    { "date": "2025-01-30", "text": "adWDawd" },
    { "date": "2025-01-30", "text": "awdsDwd" }
  ],
  "2025-01-31": [
    { "date": "2025-01-31", "text": "awdawdsad" },
    { "date": "2025-01-31", "text": "awdda" }
  ]
}

----- */