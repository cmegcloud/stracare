async function loadDoctors(){

const table =
document.getElementById("doctorTable");

table.innerHTML = "";

const snapshot =
await getDocs(collections.doctors);

snapshot.forEach(docSnap=>{

const d = docSnap.data();

table.innerHTML += `

<tr>

<td>${docSnap.id}</td>

<td>${d.doctorName}</td>

<td>${d.specialization}</td>

<td>₹${d.consultationFee}</td>

<td>

<button onclick="editDoctor('${docSnap.id}')">

Edit

</button>

<button onclick="deleteDoctor('${docSnap.id}')">

Delete

</button>

</td>

</tr>

`;

});

}

function openDoctorForm(){

openModal(
"Add Doctor",

`

<div style="display:grid;gap:12px;">

<input
id="doctorName"
placeholder="Doctor Name">

<input
id="specialization"
placeholder="Specialization">

<input
id="consultationFee"
placeholder="Consultation Fee">

<button onclick="saveDoctor()">

Save Doctor

</button>

</div>

`

);

}

async function saveDoctor(){

const doctorName =
document.getElementById("doctorName").value;

const specialization =
document.getElementById("specialization").value;

const consultationFee =
Number(
document.getElementById("consultationFee").value
);

await addDoc(
collections.doctors,
{

doctorName,
specialization,
consultationFee,

active:true,

createdAt:
serverTimestamp()

}
);

closeModal();

showToast(
"Doctor Added"
);

loadDoctors();

}

async function deleteDoctor(id){

if(
!confirm(
"Delete Doctor?"
)
)return;

await deleteDoc(
doc(db,"doctors",id)
);

showToast(
"Doctor Deleted"
);

loadDoctors();

}