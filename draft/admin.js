// --- Authentication Setup ---
const users = [
    { email: "shanicm@gmail.com", pass: "CM02", role: "Owner" },
    { email: "nibashanid@gmail.com", pass: "CM2026", role: "Staff" }
];

let currentUser = null;

// Check Login on Load
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('stra_admin_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('userRoleDisplay').textContent = `${currentUser.role} Account`;
    } else {
        document.getElementById('loginOverlay').classList.remove('hidden');
    }
});

// Handle Login Submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    const validUser = users.find(u => u.email === email && u.pass === pass);

    if (validUser) {
        currentUser = validUser;
        localStorage.setItem('stra_admin_user', JSON.stringify(validUser));
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('userRoleDisplay').textContent = `${currentUser.role} Account`;
        errorEl.classList.add('hidden');
    } else {
        errorEl.classList.remove('hidden');
    }
});

function handleLogout() {
    localStorage.removeItem('stra_admin_user');
    currentUser = null;
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginOverlay').classList.remove('hidden');
    toggleSidebar(); // close sidebar if open
}


// --- Theme & Layout Setup ---
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('admin_theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('themeIcon');
    if(isDark) {
        icon.className = "fa-solid fa-sun";
        icon.parentElement.classList.add('text-yellow-400');
    } else {
        icon.className = "fa-solid fa-moon";
        icon.parentElement.classList.remove('text-yellow-400');
    }
}

if (localStorage.admin_theme === 'dark' || (!('admin_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById('themeIcon').className = "fa-solid fa-sun";
        document.getElementById('themeIcon').parentElement.classList.add('text-yellow-400');
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
}

// Clock
setInterval(() => {
    const clockEl = document.getElementById('adminClock');
    if(clockEl) clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: true });
}, 1000);


// --- Data & Firebase Logic ---
let allAppointments = [];
let selectedBranchFilter = "All";
let globalViewMode = "All"; // All, Pending, Completed, Cancelled

function setGlobalView(mode) {
    globalViewMode = mode;
    document.getElementById('viewTitle').textContent = mode === "All" ? "DASHBOARD OVERVIEW" : `${mode.toUpperCase()} SLOTS`;
    toggleSidebar();
    updateDashboardAndTable();
}

// Main Branch Dropdown Listener
document.getElementById('branchFilterMain').addEventListener('change', (e) => {
    selectedBranchFilter = e.target.value;
    updateDashboardAndTable();
});

// Custom Sort function: Pending first, then date descending
function customSort(a, b) {
    // Both pending
    if (a.serviceStatus === "Pending" && b.serviceStatus === "Pending") {
        return new Date(b.date) - new Date(a.date);
    }
    // Only A is pending
    if (a.serviceStatus === "Pending") return -1;
    // Only B is pending
    if (b.serviceStatus === "Pending") return 1;
    
    // Neither are pending, sort by date desc
    return new Date(b.date) - new Date(a.date);
}


// Real-time Firestore Listener
db.collection('appointments').onSnapshot((snapshot) => {
    allAppointments = [];

    snapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        
        // Data Normalization
        data.serviceStatus = data.serviceStatus || "Pending";
        data.paymentStatus = data.paymentStatus || "Pending";
        data.actualFee = data.actualFee !== undefined ? Number(data.actualFee) : Number(data.amount);
        data.advanceReceived = data.advanceReceived !== undefined ? Number(data.advanceReceived) : 0;
        data.upiRef = data.upiRef || "";
        
        allAppointments.push(data);
    });

    allAppointments.sort(customSort);
    updateDashboardAndTable();
});

// Render function
function updateDashboardAndTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    let totalSlots = 0, pendingSlots = 0, doneSlots = 0, totalReceivables = 0;

    allAppointments.forEach(data => {
        // Apply Main Branch Filter
        if(selectedBranchFilter !== "All" && data.branch !== selectedBranchFilter) return;

        // Apply Global View Mode Filter (Sidebar)
        if(globalViewMode === "Pending" && data.serviceStatus !== "Pending") return;
        if(globalViewMode === "Completed" && (data.serviceStatus === "Pending" || data.serviceStatus === "Not Come" || data.serviceStatus === "Cancelled")) return;
        if(globalViewMode === "Cancelled" && (data.serviceStatus !== "Not Come" && data.serviceStatus !== "Cancelled")) return;

        let balance = data.actualFee - data.advanceReceived;

        // Dashboard Calcs (Only visible views)
        totalSlots++;
        if(data.serviceStatus === "Pending") pendingSlots++;
        if(data.serviceStatus === "Done") doneSlots++;
        if(data.serviceStatus !== "Not Come" && data.serviceStatus !== "Cancelled") {
            totalReceivables += balance > 0 ? balance : 0;
        }

        // --- Row Color Logic ---
        let rowClass = "hover:bg-gray-100 dark:hover:bg-gray-700 transition data-row"; // Added data-row for filtering
        
        const isPaid = data.paymentStatus === "Fully Paid" || data.advanceReceived >= data.actualFee;
        const isDone = data.serviceStatus === "Done";
        const isCancelled = data.serviceStatus === "Not Come" || data.serviceStatus === "Cancelled";

        if (isCancelled) {
            rowClass = "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 data-row";
        } else if (isDone && isPaid) {
            rowClass = "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100 data-row";
        } else if (isPaid && !isDone) {
            rowClass = "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 data-row";
        } else if (isDone && !isPaid) {
            rowClass = "bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 data-row";
        } else {
            rowClass = "bg-white dark:bg-gray-800 " + rowClass;
        }

        let reqDate = data.date ? new Date(data.date).toLocaleDateString('en-GB') : "N/A";

        // Build Row (Adding text data for multi-filter indexing)
        const tr = document.createElement('tr');
        tr.className = rowClass;
        tr.innerHTML = `
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 filter-col-trn">
                <div class="font-mono text-xs font-bold mb-1 tracking-tight">${data.transactionId || "N/A"}</div>
                <div class="text-[11px] opacity-80"><i class="fa-regular fa-calendar text-brandTeal"></i> ${reqDate} | ${data.time || ""}</div>
            </td>
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 filter-col-patient">
                <div class="font-bold text-sm">${data.patientName || "Unknown"} <span class="font-normal opacity-70">(${data.age||'-'} ${data.gender?data.gender.charAt(0):'-'})</span></div>
                <div class="text-[11px] font-mono font-bold text-brandTeal">${data.phone}</div>
                <div class="text-xs opacity-80 truncate max-w-[150px] lg:max-w-xs" title="${data.complaint || "N/A"}">${data.complaint || "N/A"}</div>
            </td>
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 filter-col-branch">
                <div class="text-sm font-bold text-brandTeal">${(data.branch || "N/A").replace("Theracare ", "").replace("Stracare ", "")}</div>
                <div class="text-xs font-medium opacity-80"><i class="fa-solid fa-user-doctor"></i> ${data.doctor || "Any"}</div>
            </td>
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 font-mono text-xs">
                <div>Fee: ₹${data.actualFee}</div>
                <div class="text-green-600 dark:text-green-400">Adv: ₹${data.advanceReceived}</div>
                <div class="text-red-600 dark:text-red-400 font-bold">Bal: ₹${balance}</div>
            </td>
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 text-[11px] font-bold uppercase tracking-wide filter-col-status">
                <div class="mb-1">SRV: <span class="${data.serviceStatus==='Done'?'text-green-600 dark:text-green-400': isCancelled?'text-red-600 dark:text-red-400':''}">${data.serviceStatus}</span></div>
                <div>PAY: <span class="${data.paymentStatus==='Fully Paid'?'text-blue-600 dark:text-blue-400':''}">${data.paymentStatus}</span></div>
            </td>
            <td class="p-3 border-b border-gray-200 dark:border-gray-700 text-center align-middle">
                <div class="flex items-center justify-center gap-2">
                    <a href="tel:+91${data.phone}" class="bg-brandNavy dark:bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition shadow" title="Call Patient">
                        <i class="fa-solid fa-phone text-xs"></i>
                    </a>
                    <button onclick="openModal('${data.id}')" class="bg-brandTeal text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition shadow" title="Edit Status">
                        <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Update Dashboard Metrics
    document.getElementById('dashTotal').textContent = totalSlots;
    document.getElementById('dashPending').textContent = pendingSlots;
    document.getElementById('dashDone').textContent = doneSlots;
    document.getElementById('dashReceivables').textContent = "₹" + totalReceivables;
    
    // Re-run filter just in case
    filterTable();
}

// --- Multi-Column Filtering Logic ---
function filterTable() {
    const inputTrn = document.getElementById("filterTrn").value.toUpperCase();
    const inputPatient = document.getElementById("filterPatient").value.toUpperCase();
    const inputBranch = document.getElementById("filterBranch").value.toUpperCase();
    const inputStatus = document.getElementById("filterStatus").value.toUpperCase();
    
    const rows = document.querySelectorAll("tr.data-row");

    rows.forEach(row => {
        let textTrn = row.querySelector(".filter-col-trn").textContent.toUpperCase();
        let textPatient = row.querySelector(".filter-col-patient").textContent.toUpperCase();
        let textBranch = row.querySelector(".filter-col-branch").textContent.toUpperCase();
        let textStatus = row.querySelector(".filter-col-status").textContent.toUpperCase();

        if (
            textTrn.indexOf(inputTrn) > -1 &&
            textPatient.indexOf(inputPatient) > -1 &&
            textBranch.indexOf(inputBranch) > -1 &&
            textStatus.indexOf(inputStatus) > -1
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// --- Modal Functions ---
const modal = document.getElementById('editModal');
const modalInner = modal.querySelector('div');

function openModal(id) {
    const data = allAppointments.find(d => d.id === id);
    if(!data) return;

    document.getElementById('editDocId').value = id;
    document.getElementById('displayPatientName').textContent = `${data.patientName} (${data.transactionId})`;
    document.getElementById('displayPatientMobile').textContent = `Mobile: ${data.phone}`;
    
    // Handle Timestamp display
    let lastEdited = "Never";
    if (data.updatedAt) {
        // Handle Firebase Timestamp object
        let dateObj = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
        lastEdited = dateObj.toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    }
    document.getElementById('displayLastEdited').textContent = lastEdited;

    document.getElementById('editServiceStatus').value = data.serviceStatus;
    document.getElementById('editPaymentStatus').value = data.paymentStatus;
    document.getElementById('editActualFee').value = data.actualFee;
    document.getElementById('editAdvance').value = data.advanceReceived;
    document.getElementById('editUpi').value = data.upiRef;

    // Show Delete button only to Owner
    if(currentUser && currentUser.role === "Owner") {
        document.getElementById('deleteBtn').classList.remove('hidden');
    } else {
        document.getElementById('deleteBtn').classList.add('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalInner.classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    modal.classList.add('opacity-0');
    modalInner.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// Save Update to Firebase
async function saveUpdate() {
    const id = document.getElementById('editDocId').value;
    const service = document.getElementById('editServiceStatus').value;
    const payment = document.getElementById('editPaymentStatus').value;
    const actual = Number(document.getElementById('editActualFee').value);
    const advance = Number(document.getElementById('editAdvance').value);
    const upi = document.getElementById('editUpi').value.trim();

    const btn = event.currentTarget;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
        await db.collection("appointments").doc(id).update({
            serviceStatus: service,
            paymentStatus: payment,
            actualFee: actual,
            advanceReceived: advance,
            upiRef: upi,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp() // Sets the last edited timestamp
        });
        closeModal();
    } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update status. Check permissions or network.");
    } finally {
        btn.innerHTML = origHTML;
        btn.disabled = false;
    }
}

// Delete Record
async function deleteRecord() {
    const id = document.getElementById('editDocId').value;
    if(confirm("Are you sure you want to PERMANENTLY DELETE this record? This cannot be undone.")) {
        try {
            await db.collection("appointments").doc(id).delete();
            closeModal();
        } catch(error) {
            console.error("Error deleting document: ", error);
            alert("Failed to delete record.");
        }
    }
}
