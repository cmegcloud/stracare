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
// LOGIN CHECK
// =====================

document.addEventListener("DOMContentLoaded", async () => {

    const userData =
        localStorage.getItem("currentUser");

    if (!userData) {

        window.location.href =
            "login.html";

        return;
    }

    currentUser =
        JSON.parse(userData);

    currentBranch =
        currentUser.branchId;

    const userName =
        document.getElementById("user-name");

    if (userName) {

        userName.innerText =
            currentUser.username;

    }

    await loadDashboard();

});

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

    const p =
        document.getElementById("kpiPatients");

    const d =
        document.getElementById("kpiDoctors");

    const a =
        document.getElementById("kpiAppointments");

    const r =
        document.getElementById("kpiReceivables");

    if (p)
        p.innerText =
        state.patients.length;

    if (d)
        d.innerText =
        state.doctors.length;

    if (a)
        a.innerText =
        state.appointments.length;

    if (r)
        r.innerText =
        "₹" + totalReceivable();

}

// =====================
// PATIENTS
// =====================

async function loadPatients() {

    const snap =
        await getDocs(
            collection(db, "patients")
        );

    state.patients = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.patients.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// DOCTORS
// =====================

async function loadDoctors() {

    const snap =
        await getDocs(
            collection(db, "doctors")
        );

    state.doctors = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.doctors.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// APPOINTMENTS
// =====================

async function loadAppointments() {

    const snap =
        await getDocs(
            collection(db, "appointments")
        );

    state.appointments = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.appointments.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// RECEIPTS
// =====================

async function loadReceipts() {

    const snap =
        await getDocs(
            collection(db, "receipts")
        );

    state.receipts = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.receipts.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// PAYMENTS
// =====================

async function loadPayments() {

    const snap =
        await getDocs(
            collection(db, "payments")
        );

    state.payments = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.payments.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// RECEIVABLES
// =====================

async function loadReceivables() {

    const snap =
        await getDocs(
            collection(db, "receivables")
        );

    state.receivables = [];

    snap.forEach(docSnap => {

        const row =
            docSnap.data();

        if (
            currentBranch === "ALL" ||
            row.branchId === currentBranch
        ) {

            state.receivables.push({
                id: docSnap.id,
                ...row
            });

        }

    });

}

// =====================
// TOTAL RECEIVABLE
// =====================

function totalReceivable() {

    return state.receivables.reduce(
        (sum, row) =>
        sum + Number(row.balance || 0),
        0
    );

}

// =====================
// LOGOUT
// =====================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}

window.logout = logout;
