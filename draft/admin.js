// --- Authentication Setup ---
const users = [
    { email: "shanicm@gmail.com", pass: "CM02", role: "Owner" },
    { email: "nibashanid@gmail.com", pass: "CM2026", role: "Staff" }
];

let currentUser = null;

// Initialize Auth (runs immediately)
(function initAuth() {
    const savedUser = localStorage.getItem('stra_admin_user');
    const overlay = document.getElementById('loginOverlay');

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if(overlay) overlay.classList.add('hidden');
        
        const emailEl = document.getElementById('topUserEmail');
        const roleEl = document.getElementById('topUserRole');
        if(emailEl) emailEl.textContent = currentUser.email;
        if(roleEl) roleEl.textContent = `${currentUser.role} Account`;
    } else {
        if(overlay) overlay.classList.remove('hidden');
        const emailEl = document.getElementById('topUserEmail');
        const roleEl = document.getElementById('topUserRole');
        if(emailEl) emailEl.textContent = "Not logged in";
        if(roleEl) roleEl.textContent = "---";
    }
})();

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
        
        const emailEl = document.getElementById('topUserEmail');
        const roleEl = document.getElementById('topUserRole');
        if(emailEl) emailEl.textContent = currentUser.email;
        if(roleEl) roleEl.textContent = `${currentUser.role} Account`;

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
    
    const emailEl = document.getElementById('topUserEmail');
    const roleEl = document.getElementById('topUserRole');
    if(emailEl) emailEl.textContent = "Not logged in";
    if(roleEl) roleEl.textContent = "---";

    document.getElementById('loginOverlay').classList.remove('hidden');
    
    const sidebar = document.getElementById('sidebar');
    if(!sidebar.classList.contains('-translate-x-full')) toggleSidebar();
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
    const icon = document.getElementById('themeIcon');
    if(icon) {
        icon.className = "fa-solid fa-sun";
        icon.parentElement.classList.add('text-yellow-400');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full');
    
    if(sidebar.classList.contains('-translate-x-full')) {
        overlay.classList.add('opacity-0'); 
        setTimeout(() => overlay.classList.add('hidden'), 300);
    } else {
        overlay.classList.remove('hidden'); 
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    }
}

// Running Clock (Date & Time)
setInterval(() => {
    const clockEl = document.getElementById('adminClock');
    if(clockEl) {
        const now = new Date();
        const dateOpts = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        clockEl.innerHTML = `${now.toLocaleDateString('en-US', dateOpts)} &nbsp;|&nbsp; ${now.toLocaleTimeString('en-US', timeOpts)}`;
    }
}, 1000);


// --- Data & Firebase Logic ---
let allAppointments = [];
let selectedBranchFilter = "All";
let globalViewMode = "All"; 

function setGlobalView(mode) {
    globalViewMode = mode;
    document.getElementById('viewTitle').textContent = mode === "All" ? "Dashboard Overview" : `${mode} Slots`;
    if(window.innerWidth < 1024) toggleSidebar(); 
    updateDashboardAndTable();
}

document.getElementById('branchFilterMain').addEventListener('change', (e) => {
    selectedBranchFilter = e.target.value;
    updateDashboardAndTable();
});

function customSort(a, b) {
    if (a.serviceStatus === "Pending" && b.serviceStatus === "Pending") return new Date(b.date) - new Date(a.date);
    if (a.serviceStatus === "Pending") return -1;
    if (b.serviceStatus === "Pending") return 1;
    return new Date(b.date) - new Date(a.date);
}

db.collection('appointments').onSnapshot((snapshot) => {
    allAppointments = [];

    snapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        
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

function updateDashboardAndTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    let totalSlots = 0, pendingSlots = 0, doneSlots = 0, totalReceivables = 0;

    allAppointments.forEach(data => {
        if(selectedBranchFilter !== "All" && data.branch !== selectedBranchFilter) return;

        if(globalViewMode === "Pending" && data.serviceStatus !== "Pending") return;
        if(globalViewMode === "Completed" && (data.serviceStatus === "Pending" || data.serviceStatus === "Not Come" || data.serviceStatus === "Cancelled")) return;
        if(globalViewMode === "Cancelled" && (data.serviceStatus !== "Not Come" && data.serviceStatus !== "Cancelled")) return;

        let balance = data.actualFee - data.advanceReceived;

        totalSlots++;
        if(data.serviceStatus === "Pending") pendingSlots++;
        if(data.serviceStatus === "Done") doneSlots++;
        if(data.serviceStatus !== "Not Come" && data.serviceStatus !== "Cancelled") {
            totalReceivables += balance > 0 ? balance : 0;
        }

        // Row Colors matching ERP premium feel (subtle backgrounds)
        let rowClass = "border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-300 data-row "; 
        let bgClass = "bg-white dark:bg-transparent";

        const isPaid = data.paymentStatus === "Fully Paid" || data.advanceReceived >= data.actualFee;
        const isDone = data.serviceStatus === "Done";
        const isCancelled = data.serviceStatus === "Not Come" || data.serviceStatus === "Cancelled";

        if (isCancelled) {
            bgClass = "bg-red-50/50 dark:bg-red-900/10";
        } else if (isDone && isPaid) {
            bgClass = "bg-emerald-50/50 dark:bg-emerald-900/10";
        } else if (isPaid && !isDone) {
            bgClass = "bg-blue-50/50 dark:bg-blue-900/10";
        } else if (isDone && !isPaid) {
            bgClass = "bg-purple-50/50 dark:bg-purple-900/10";
        }

        rowClass += bgClass;
        let reqDate = data.date ? new Date(data.date).toLocaleDateString('en-GB') : "--";

        // Badges for Status
        let srvBadge = data.serviceStatus === 'Done' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : isCancelled ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
        let payBadge = data.paymentStatus === 'Fully Paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';

        const tr = document.createElement('tr');
        tr.className = rowClass;
        tr.innerHTML = `
            <td class="p-4 whitespace-nowrap">
                <div class="font-bold text-[#5453EC] dark:text-indigo-400 mb-1 text-xs tracking-tight">${data.transactionId || "--"}</div>
                <div class="text-[11px] text-slate-500 font-medium"><i class="fa-regular fa-calendar mr-1"></i> ${reqDate} | ${data.time || ""}</div>
            </td>
            <td class="p-4 whitespace-nowrap">
                <div class="font-bold text-slate-800 dark:text-white text-sm">${data.patientName || "Unknown"} <span class="text-xs font-normal text-slate-400">(${data.age||'-'} ${data.gender?data.gender.charAt(0):'-'})</span></div>
                <div class="text-[11px] font-mono font-bold text-brandTeal my-0.5"><i class="fa-solid fa-phone mr-1"></i>${data.phone}</div>
                <div class="text-[11px] text-slate-500 truncate max-w-[150px] lg:max-w-xs" title="${data.complaint || "--"}">${data.complaint || "--"}</div>
            </td>
            <td class="p-4 whitespace-nowrap">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${(data.branch || "--").replace("Theracare ", "").replace("Stracare ", "")}</div>
                <div class="text-[11px] font-medium text-slate-500 mt-1"><i class="fa-solid fa-user-doctor mr-1"></i> ${data.doctor || "Any"}</div>
            </td>
            <td class="p-4 whitespace-nowrap font-mono text-xs">
                <div class="text-slate-600 dark:text-slate-400">Fee: ₹${data.actualFee}</div>
                <div class="text-emerald-600 dark:text-emerald-400">Adv: ₹${data.advanceReceived}</div>
                <div class="text-red-600 dark:text-red-400 font-bold">Bal: ₹${balance}</div>
            </td>
            <td class="p-4 whitespace-nowrap">
                <div class="mb-1.5"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${srvBadge}">S: ${data.serviceStatus}</span></div>
                <div><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${payBadge}">P: ${data.paymentStatus}</span></div>
            </td>
            <td class="p-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center gap-2">
                    <a href="tel:+91${data.phone}" class="text-brandTeal hover:text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:hover:text-teal-300 px-3 py-1.5 rounded-lg transition-colors shadow-sm text-xs font-bold flex items-center gap-1">
                        <i class="fa-solid fa-phone"></i> Call
                    </a>
                    <button onclick="openModal('${data.id}')" class="text-[#5453EC] hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 dark:hover:text-indigo-300 px-3 py-1.5 rounded-lg transition-colors shadow-sm text-xs font-bold flex items-center gap-1">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('dashTotal').textContent = totalSlots;
    document.getElementById('dashPending').textContent = pendingSlots;
    document.getElementById('dashDone').textContent = doneSlots;
    document.getElementById('dashReceivables').textContent = "₹" + totalReceivables.toLocaleString('en-IN');
    
    masterSearchTable();
}

// --- Master Search Logic ---
function masterSearchTable() {
    const input = document.getElementById("masterSearch").value.toUpperCase();
    const rows = document.querySelectorAll("tr.data-row");

    rows.forEach(row => {
        const textContent = row.textContent.toUpperCase();
        if (textContent.indexOf(input) > -1) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// --- Modal Functions ---
const modal = document.getElementById('editModal');
const modalInner = document.getElementById('modalInner');

function openModal(id) {
    const data = allAppointments.find(d => d.id === id);
    if(!data) return;

    document.getElementById('editDocId').value = id;
    document.getElementById('displayPatientName').textContent = `${data.patientName} (${data.transactionId})`;
    document.getElementById('displayPatientMobile').textContent = `Mobile: ${data.phone}`;
    
    let lastEdited = "Never";
    if (data.updatedAt) {
        let dateObj = data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt);
        lastEdited = dateObj.toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
    }
    document.getElementById('displayLastEdited').textContent = lastEdited;

    document.getElementById('editServiceStatus').value = data.serviceStatus;
    document.getElementById('editPaymentStatus').value = data.paymentStatus;
    document.getElementById('editActualFee').value = data.actualFee;
    document.getElementById('editAdvance').value = data.advanceReceived;
    document.getElementById('editUpi').value = data.upiRef;

    if(currentUser && currentUser.role === "Owner") {
        document.getElementById('deleteBtn').classList.remove('hidden');
    } else {
        document.getElementById('deleteBtn').classList.add('hidden');
    }

    modal.classList.remove('hidden');
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
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
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
