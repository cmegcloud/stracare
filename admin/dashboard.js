async function loadDashboard(){

const today =
new Date()
.toISOString()
.split("T")[0];

let appointmentCount = 0;
let pendingCount = 0;

let totalCollection = 0;
let totalOutstanding = 0;

const table =
document.getElementById(
"todayAppointmentsTable"
);

table.innerHTML = "";

const appointments =
await getDocs(
collections.appointments
);

appointments.forEach(docSnap=>{

const data =
docSnap.data();

if(
data.appointmentDate === today
){

appointmentCount++;

table.innerHTML += `

<tr>

<td>${data.appointmentTime}</td>

<td>${data.patientName}</td>

<td>${data.doctorName}</td>

<td>${data.status}</td>

</tr>

`;

}

if(
data.status==="Pending"
){

pendingCount++;

}

if(
data.balanceAmount
){

totalOutstanding +=
Number(
data.balanceAmount
);

}

});

const receipts =
await getDocs(
collections.receipts
);

receipts.forEach(docSnap=>{

const r =
docSnap.data();

totalCollection +=
Number(
r.amount || 0
);

});

document.getElementById(
"todayAppointments"
).innerHTML =
appointmentCount;

document.getElementById(
"pendingConsultation"
).innerHTML =
pendingCount;

document.getElementById(
"todayCollection"
).innerHTML =
"₹" +
totalCollection;

document.getElementById(
"outstanding"
).innerHTML =
"₹" +
totalOutstanding;

}