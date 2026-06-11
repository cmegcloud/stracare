// app.js

let currentUser = null;
let currentBranch = null;

const state = {
    patients: [],
    doctors: [],
    appointments: [],
    receipts: [],
    payments: [],
    receivables: []
};

// =====================
// AUTH CHECK
// =====================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadUserProfile();

    await loadDashboard();

});

// =====================
// USER PROFILE
// =====================

async function loadUserProfile() {

    const snap = await getDoc(
        doc(db, "users", currentUser.uid)
    );

    if (!snap.exists()) return;

    const data = snap.data();

    currentBranch = data.branchId;

    document.getElementById("user-name").innerText =
        data.name || "User";

}

// =====================
// DASHBOARD
// =====================

async function loadDashboard() {

    await Promise.all([
        loadPatients(),
        loadDoctors(),
        loadAppointments(),
        loadReceipts(),
        loadPayments(),
        loadReceivables()
    ]);

    renderKPIs();

}

// =====================
// KPI CARDS
// =====================

function renderKPIs() {

    document.getElementById("kpiPatients").innerText =
        state.patients.length;

    document.getElementById("kpiDoctors").innerText =
        state.doctors.length;

    document.getElementById("kpiAppointments").innerText =
        state.appointments.length;

    document.getElementById("kpiReceivables").innerText =
        "₹" + totalReceivable();

}

// =====================
// PATIENTS
// =====================

async function loadPatients() {

    const snap = await getDocs(
        collection(db, "patients")
    );

    state.patients = [];

    snap.forEach(doc => {

        state.patients.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// DOCTORS
// =====================

async function loadDoctors() {

    const snap = await getDocs(
        collection(db, "doctors")
    );

    state.doctors = [];

    snap.forEach(doc => {

        state.doctors.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// APPOINTMENTS
// =====================

async function loadAppointments() {

    const snap = await getDocs(
        collection(db, "appointments")
    );

    state.appointments = [];

    snap.forEach(doc => {

        state.appointments.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// RECEIPTS
// =====================

async function loadReceipts() {

    const snap = await getDocs(
        collection(db, "receipts")
    );

    state.receipts = [];

    snap.forEach(doc => {

        state.receipts.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// PAYMENTS
// =====================

async function loadPayments() {

    const snap = await getDocs(
        collection(db, "payments")
    );

    state.payments = [];

    snap.forEach(doc => {

        state.payments.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// RECEIVABLES
// =====================

async function loadReceivables() {

    const snap = await getDocs(
        collection(db, "receivables")
    );

    state.receivables = [];

    snap.forEach(doc => {

        state.receivables.push({
            id: doc.id,
            ...doc.data()
        });

    });

}

// =====================
// TOTAL RECEIVABLE
// =====================

function totalReceivable() {

    return state.receivables.reduce(
        (sum, row) => sum + Number(row.balance || 0),
        0
    );

}

// =====================
// LOGOUT
// =====================

async function logout() {

    await signOut(auth);

}