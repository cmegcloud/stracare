// patients.js

// ===========================
// ADD / UPDATE PATIENT
// ===========================

alert("Patients JS Loaded");

async function savePatient() {

    try {

        alert("1");

        await window.setDoc(

            window.doc(
                window.db,
                "patients",
                "TEST123"
            ),

            {
                mobile:"TEST123",
                patientName:"Test Patient"
            }

        );

        alert("2");

    } catch(error){

        alert(error.message);

    }

}
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
            currentBranch || "ALL",

            updatedAt:
            new Date()

        };

        alert("Before Save");

        await window.setDoc(

            window.doc(
                window.db,
                "patients",
                mobile
            ),

            patientData,

            {
                merge:true
            }

        );

        alert("After Save");

        await loadPatients();

        renderPatients();

        alert("Patient Saved Successfully");

    }
    catch(error){

        console.error(error);

        alert(
            "ERROR : " +
            error.message
        );

    }

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

    await loadPatients();
renderPatients();

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

setTimeout(() => {

    const mobileInput =
        document.getElementById("patientMobile");

    if(mobileInput){

        mobileInput.addEventListener(
            "keyup",
            function(){

                searchPatientByMobile(
                    this.value
                );

            }
        );

    }

    renderPatients();

}, 300);

window.savePatient = savePatient;
window.openPatient = openPatient;
window.deletePatient = deletePatient;
window.renderPatients = renderPatients;

setTimeout(async () => {

    await loadPatients();

    renderPatients();

}, 500);
