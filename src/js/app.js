// Variables globales
let currentDate = new Date();
let reminders = [];
let selectedDay = null;  // Variable para almacenar el día seleccionado

// Elementos del DOM
const currentMonthElem = document.getElementById('current-month');
const calendarGrid = document.getElementById('calendar-grid');
const reminderList = document.getElementById('reminders');
const addReminderButton = document.getElementById('add-reminder');
const reminderDateInput = document.getElementById('reminder-date');
const reminderTextInput = document.getElementById('reminder-text');

// Función para obtener el nombre del día de la semana
function getDayName(date) {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[date.getDay()];
}

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
// Función para actualizar el calendario
function updateCalendar() {
  // Obtenemos el mes y el año actual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Actualizamos el nombre del mes
  currentMonthElem.textContent = `${months[month]} ${year}`;
  
  // Limpiamos el calendario
  calendarGrid.innerHTML = '';
  
  // Obtener el primer día del mes y el número de días del mes
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Ajustamos el primer día de la semana para que sea lunes (en vez de domingo)
  const firstDayOffset = (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1); // Si el primer día es domingo (0), lo desplazamos a 6 (sábado)
  
  // Rellenar los días anteriores con espacios
  for (let i = 0; i < firstDayOffset; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'empty';
    calendarGrid.appendChild(emptyCell);
  }
  
  // Rellenar los días del mes
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayCell = document.createElement('div');
    const currentDayDate = new Date(year, month, i);
    const dayName = getDayName(currentDayDate);  // Obtenemos el nombre del día
    
    const titleCell = document.createElement('div');

    // Mostrar el día de la semana antes de la fecha
    dayCell.innerHTML = `<h4>${dayName} ${i}</h4>`;
    dayCell.className = 'day';
    dayCell.addEventListener('click', () => selectDay(dayCell, year, month, i));

    const masterBox = document.createElement('div');
    masterBox.className = 'masterBox';
    // Verificar si hay recordatorios para este día
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayReminders = reminders.filter(r => r.date === dateString);
    
    if (dayReminders.length > 0) {
      dayReminders.forEach((reminder, index) => {
        const reminderDiv = document.createElement('div');
        reminderDiv.textContent = reminder.text;
        reminderDiv.className = 'box';
        
        const deleteButton = document.createElement('a');
        deleteButton.textContent = 'X';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.marginLeft = '5px';
        deleteButton.addEventListener('click', () => {
          // Eliminar el recordatorio utilizando el índice
          reminders = reminders.filter((_, i) => i !== index);
          updateCalendar();
          updateReminderList();
        });
        
        masterBox.appendChild(reminderDiv);
        reminderDiv.appendChild(deleteButton);
        dayCell.appendChild(masterBox);
      });
    }
    
    calendarGrid.appendChild(dayCell);
  }
}

// Función para seleccionar un día y destacarlo
function selectDay(dayCell, year, month, day) {
  // Si ya hay un día seleccionado, lo desmarcamos
  if (selectedDay) {
    selectedDay.classList.remove('selected-day');
  }

  // Marcar el nuevo día como seleccionado
  dayCell.classList.add('selected-day');
  selectedDay = dayCell;  // Actualizamos el día seleccionado

  // Abrimos el diálogo para añadir recordatorio
  reminderDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  reminderTextInput.focus();
}

// Función para abrir el diálogo de recordatorios para una fecha
function openReminderDialog(year, month, day) {
  reminderDateInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  reminderTextInput.focus();
}

addReminderButton.addEventListener('click', () => {
  const date = reminderDateInput.value;
  const text = reminderTextInput.value;
  
  if (date && text) {
    reminders.push({ date, text });
    updateCalendar();
    updateReminderList();
    reminderTextInput.value = '';
  }
});

function updateReminderList() {
  reminderList.innerHTML = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza la fecha de hoy

  // Ordenar recordatorios por fecha (ascendente)
  reminders.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  reminders.forEach((reminder, index) => {
    const [year, month, day] = reminder.date.split('-').map(Number);
    const reminderDate = new Date(year, month - 1, day);
    reminderDate.setHours(0, 0, 0, 0); // Normalizar fecha

    const dayName = getDayName(reminderDate);  

    const li = document.createElement('li');
    li.textContent = `${dayName.substring(0, 3).toUpperCase()}, ${day}-${months[month].substring(0, 3)}: ${reminder.text} `;

    // Cambiar color según la fecha del recordatorio
    if (reminderDate < today) {
      li.className = 'pasado'; // Pasado
    } else if (reminderDate.getTime() === today.getTime()) {
      li.className = 'presente'; // Hoy
    } else {
      li.className = 'futuro'; // Futuro
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'eliminar';
    deleteButton.addEventListener('click', () => {
      reminders.splice(index, 1);
      updateCalendar();
      updateReminderList();
    });

    li.appendChild(deleteButton);
    reminderList.appendChild(li);
  });
}


// Función para cambiar de mes
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});

// Inicializamos el calendario
updateCalendar();


