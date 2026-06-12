// appointments.js

let editingAppointment = null;

// ===========================
// LOAD APPOINTMENTS
// ===========================

async function loadAppointments(){

    const table =
    document.getElementById(
        "appointmentTable"
    );

    if(!table) return;

    table.innerHTML = "";

    const snapshot =
    await window.getDocs(
        window.collections.appointments
    );

    snapshot.forEach(docSnap=>{

        const a =
        docSnap.data();

        if(
            window.currentBranch !== "ALL" &&
            a.branchId !== window.currentBranch
        ){
            return;
        }

        table.innerHTML += `

        <tr>

            <td>${a.appointmentDate || ''}</td>

            <td>${a.appointmentTime || ''}</td>

            <td>${a.patientName || ''}</td>

            <td>${a.mobile || ''}</td>

            <td>${a.doctorName || ''}</td>

            <td>${a.status || ''}</td>

            <td>

                <button
                onclick="deleteAppointment('${docSnap.id}')">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ===========================
// NEW APPOINTMENT FORM
// ===========================

function openAppointmentForm(){

    openModal(

        "New Appointment",

        `

        <div style="display:grid;gap:12px">

            <input
            id="mobile"
            placeholder="Mobile Number">

            <input
            id="patientName"
            placeholder="Patient Name">

            <input
            id="appointmentDate"
            type="date">

            <input
            id="appointmentTime"
            type="time">

            <input
            id="doctorName"
            placeholder="Doctor Name">

            <input
            id="consultationFee"
            type="number"
            placeholder="Consultation Fee">

            <select id="status">

                <option value="Booked">
                    Booked
                </option>

                <option value="Pending">
                    Pending
                </option>

                <option value="Completed">
                    Completed
                </option>

                <option value="Cancelled">
                    Cancelled
                </option>

            </select>

            <button
            onclick="saveAppointment()">

                Save Appointment

            </button>

        </div>

        `

    );

}

// ===========================
// SAVE APPOINTMENT
// ===========================

async function saveAppointment(){

    try{

        const fee =
        Number(
            document.getElementById(
                "consultationFee"
            ).value || 0
        );

        const appointment = {

            mobile:
            document.getElementById(
                "mobile"
            ).value,

            patientName:
            document.getElementById(
                "patientName"
            ).value,

            branchId:
            window.currentBranch || "ALL",

            appointmentDate:
            document.getElementById(
                "appointmentDate"
            ).value,

            appointmentTime:
            document.getElementById(
                "appointmentTime"
            ).value,

            doctorName:
            document.getElementById(
                "doctorName"
            ).value,

            consultationFee:
            fee,

            receivedAmount:0,

            balanceAmount:
            fee,

            status:
            document.getElementById(
                "status"
            ).value,

            bookingSource:"Admin",

            rescheduled:false,

            cancelled:false,

            createdAt:
            window.serverTimestamp()

        };

        await window.addDoc(
            window.collections.appointments,
            appointment
        );

        closeModal();

        showToast(
            "Appointment Saved"
        );

        await loadAppointments();

    }
    catch(error){

        alert(
            "ERROR : " +
            error.message
        );

    }

}

// ===========================
// DELETE APPOINTMENT
// ===========================

async function deleteAppointment(id){

    if(
        !confirm(
            "Delete Appointment?"
        )
    ) return;

    await window.deleteDoc(

        window.doc(
            window.db,
            "appointments",
            id
        )

    );

    showToast(
        "Appointment Deleted"
    );

    await loadAppointments();

}

// ===========================
// RESCHEDULE
// ===========================

async function rescheduleAppointment(
    id,
    newDate
){

    await window.updateDoc(

        window.doc(
            window.db,
            "appointments",
            id
        ),

        {

            rescheduled:true,

            rescheduledDate:newDate,

            appointmentDate:newDate,

            status:"Rescheduled"

        }

    );

    showToast(
        "Appointment Rescheduled"
    );

    await loadAppointments();

}

// ===========================
// EXPORTS
// ===========================

window.loadAppointments =
loadAppointments;

window.openAppointmentForm =
openAppointmentForm;

window.saveAppointment =
saveAppointment;

window.deleteAppointment =
deleteAppointment;

window.rescheduleAppointment =
rescheduleAppointment;

// ===========================
// AUTO LOAD
// ===========================

setTimeout(()=>{

    loadAppointments();

},500);
