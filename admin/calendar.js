let selectedDate = null;

async function loadCalendar() {

    const currentDate = new Date();

    renderCalendar(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

}

function renderCalendar(year, month) {

    const grid =
        document.getElementById(
            "calendarGrid"
        );

    grid.innerHTML = "";

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for(let day=1; day<=daysInMonth; day++){

        const dateString =

            `${year}-${
                String(month+1)
                .padStart(2,'0')
            }-${
                String(day)
                .padStart(2,'0')
            }`;

        const bookings =

            state.appointments.filter(

                a =>
                a.appointmentDate ===
                dateString

            );

        const card =
        document.createElement("div");

        card.className =
        "border rounded p-3 cursor-pointer";

        card.innerHTML = `

            <div class="font-bold">
                ${day}
            </div>

            <div class="text-xs mt-2">

                ${bookings.length}
                Booking(s)

            </div>

        `;

        card.onclick = () => {

            selectedDate =
                dateString;

            loadDayAppointments(
                dateString
            );

        };

        grid.appendChild(card);

    }

    updateCalendarStats();

}

function updateCalendarStats() {

    document.getElementById(
        "totalBookings"
    ).innerText =

        state.appointments.length;

    document.getElementById(
        "totalRescheduled"
    ).innerText =

        state.appointments.filter(

            x =>
            x.status ===
            "Rescheduled"

        ).length;

    document.getElementById(
        "totalCancelled"
    ).innerText =

        state.appointments.filter(

            x =>
            x.status ===
            "Cancelled"

        ).length;

    document.getElementById(
        "totalCompleted"
    ).innerText =

        state.appointments.filter(

            x =>
            x.status ===
            "Completed"

        ).length;

}

function loadDayAppointments(date) {

    const tbody =
        document.getElementById(
            "dayAppointments"
        );

    tbody.innerHTML = "";

    const data =

        state.appointments.filter(

            a =>
            a.appointmentDate === date

        );

    data.forEach(row => {

        tbody.innerHTML += `

        <tr>

            <td>
                ${row.appointmentTime}
            </td>

            <td>
                ${row.patientName}
            </td>

            <td>
                ${row.mobile}
            </td>

            <td>
                ${row.status}
            </td>

        </tr>

        `;

    });

}
