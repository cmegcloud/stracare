// patients.js

// ===========================
// ADD / UPDATE PATIENT
// ===========================

async function savePatient() {

    const mobile =
        document.getElementById("patientMobile").value.trim();

    const patientData = {

        mobile: mobile,

        patientName:
            document.getElementById("patientName").value,

        gender:
            document.getElementById("patientGender").value,

        age:
            document.getElementById("patientAge").value,

        address:
            document.getElementById("patientAddress").value,

        notes:
            document.getElementById("patientNotes").value,

        branchId:
            currentBranch,

        updatedAt:
            serverTimestamp()

    };

    await setDoc(
        doc(db, "patients", mobile),
        patientData,
        { merge: true }
    );

    alert("Patient Saved");

    loadPatients();

}

// ===========================
// SEARCH BY MOBILE
// ===========================

async function searchPatientByMobile(mobile) {

    if (mobile.length < 10) return;

    const snap = await getDoc(
        doc(db, "patients", mobile)
    );

    if (!snap.exists()) {

        clearPatientForm();
        return;

    }

    const data = snap.data();

    document.getElementById("patientName").value =
        data.patientName || "";

    document.getElementById("patientGender").value =
        data.gender || "";

    document.getElementById("patientAge").value =
        data.age || "";

    document.getElementById("patientAddress").value =
        data.address || "";

    document.getElementById("patientNotes").value =
        data.notes || "";

}

// ===========================
// DELETE PATIENT
// ===========================

async function deletePatient(mobile) {

    if (!confirm("Delete Patient?"))
        return;

    await deleteDoc(
        doc(db, "patients", mobile)
    );

    loadPatients();

}

// ===========================
// CLEAR FORM
// ===========================

function clearPatientForm() {

    document.getElementById("patientName").value = "";

    document.getElementById("patientGender").value = "";

    document.getElementById("patientAge").value = "";

    document.getElementById("patientAddress").value = "";

    document.getElementById("patientNotes").value = "";

}

// ===========================
// PATIENT TABLE
// ===========================

function renderPatients() {

    const tbody =
        document.getElementById("patientsTable");

    tbody.innerHTML = "";

    state.patients.forEach(patient => {

        tbody.innerHTML += `

        <tr>

            <td>${patient.mobile}</td>

            <td>${patient.patientName}</td>

            <td>${patient.gender}</td>

            <td>${patient.age}</td>

            <td>

                <button
                    onclick="openPatient('${patient.mobile}')">

                    Edit

                </button>

            </td>

        </tr>

        `;

    });

}

// ===========================
// OPEN PATIENT
// ===========================

async function openPatient(mobile) {

    const snap = await getDoc(
        doc(db, "patients", mobile)
    );

    if (!snap.exists())
        return;

    const data = snap.data();

    document.getElementById("patientMobile").value =
        data.mobile;

    document.getElementById("patientName").value =
        data.patientName;

    document.getElementById("patientGender").value =
        data.gender;

    document.getElementById("patientAge").value =
        data.age;

    document.getElementById("patientAddress").value =
        data.address;

    document.getElementById("patientNotes").value =
        data.notes;

}

// ===========================
// LIVE MOBILE SEARCH
// ===========================

document
.getElementById("patientMobile")
.addEventListener("keyup", function () {

    searchPatientByMobile(
        this.value
    );

});