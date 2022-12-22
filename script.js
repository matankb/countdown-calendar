function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('no-dark-mode-transition');
        toggleDarkMode();
        document.body.classList.remove('no-dark-mode-transition');
    }
    document.querySelector('.dark-mode-toggle').addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    const body = document.querySelector('body');
    body.classList.toggle('dark-mode');
    const icon = document.querySelector('.dark-mode-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function generateCalendarHeader() {
    const dayMarkers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return `
        <div class="calendar-header">
            ${dayMarkers.map(day => `<div class="day-marker">${day}</div>`).join('')}
        </div>
    `;
}

function getDateColor(date, today, beforeDate, start, end) {
    if (date.isSame(beforeDate)) {
        return 'orange';
    }
    if (date.isSame(today, 'day')) {
        return '#ff6161';
    }
    if (date.isSame(start, 'day') || date.isSame(end, 'day') || date.isBetween(start, end)) {
        return 'lightblue';
    }
}

function generateCalendar(beforeDate, start, end) {

    const calendarStartDate = beforeDate.clone().day(0);
    const calendarEndDate = end.clone().day(6);

    const weeks = calendarEndDate.diff(calendarStartDate, 'weeks') + 1;

    let date = calendarStartDate.clone();
    const today = moment();
    
    let html = '';
    html += generateCalendarHeader();

    for (let i = 0; i < weeks; i++) {
        html += '<div class="week">';
        for (let j = 0; j < 7; j++) {
            const background = getDateColor(date, today, beforeDate, start, end);
            const className = `day ${background ? 'color' : ''}`;
            html += `<div class="${className}" style="background:${background}">${date.date()}</div>`;
            date = date.add(1, 'days');
        }
        html += '</div>'
    }

    document.getElementById('calendar').innerHTML = html;
}

function generateSummary(daysRemaining, dateBefore) {
    const daysRemainingElements = document.querySelectorAll('.days-remaining');
    const dateBeforeElement = document.querySelector('.date-before');

    for (const daysRemainingElement of daysRemainingElements) {
        daysRemainingElement.textContent = daysRemaining;
    }
    dateBeforeElement.textContent = dateBefore.format('dddd, MMMM Do');
}

function addEventListeners(breakDates) {
    document.querySelector('.refresh').onclick = () => {
        const icon = document.querySelector('.refresh i');
        icon.classList.add('fa-spin');
        setTimeout(() => {
            icon.classList.remove('fa-spin');
        }, 300);
        generateCountdown(breakDates);
    }
    
    document.querySelector('.new').onclick = () => {
        window.location.search = '';
    }
}

function generateCountdown({ start, end }) {
    start = moment(start);
    end = moment(end);
    today = moment();

    const daysRemaining = start.diff(today, 'days') + 1;
    const dateBefore = today.subtract(daysRemaining, 'd');

    generateSummary(daysRemaining, dateBefore);
    generateCalendar(dateBefore, start, end);
}

function countdownMain(start, end) {
    document.body.classList.remove('create-view');

    generateCountdown({ start, end });
    addEventListeners({ start, end });
    loadDarkMode();
}

function addCreateEventListeners() {
    document.querySelector('#create-button').addEventListener('click', () => {
        const date = document.querySelector('#date-input').value;
        window.location.search = `?start=${date}`;
    })
}

function createMain() {
    addCreateEventListeners();
}

function main() {
    const query = new URLSearchParams(window.location.search);
    const start = query.get('start');
    const end = query.get('end') || start;
    if (start) {
        countdownMain(start, end);
    } else {
        createMain();
    }
}

main();