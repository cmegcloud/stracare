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

// Listen to Filter Change
document.getElementById('branchFilter').addEventListener('change', (e) => {
    selectedBranchFilter = e.target.value;
    updateDashboardAndTable();
});

// Real-time Firestore Listener
db.collection('appointments').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    allAppointments = [];

    snapshot.forEach(doc => {
        let data = doc.data();
        data.id = doc.id;
        
        // Data Normalization (Handle legacy/missing fields)
        data.serviceStatus = data.serviceStatus || "Pending";
        data.paymentStatus = data.paymentStatus || "Pending";
        data.actualFee = data.actualFee !== undefined ? Number(data.actualFee) : Number(data.amount);
        data.advanceReceived = data.advanceReceived !== undefined ? Number(data.advanceReceived) : 0;
        data.upiRef = data.upiRef || "";
        
        allAppointments.push(data);
    });

    updateDashboardAndTable();
});

// Core Function to Filter and Render
function updateDashboardAndTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    let totalSlots = 0, pendingSlots = 0, doneSlots = 0, totalReceivables = 0;

    allAppointments.forEach(data => {
        // Apply Branch Filter
        if(selectedBranchFilter !== "All" && data.branch !== selectedBranchFilter) {
            return; // Skip if it doesn't match the selected branch
        }

        let balance = data.actualFee - data.advanceReceived;

        // Calculate Dashboards for the filtered view (Exclude "Not Come")
        totalSlots++;
        if(data.serviceStatus === "Pending") pendingSlots++;
        if(data.serviceStatus === "Done") doneSlots++;
        if(data.serviceStatus !== "Not Come") {
            totalReceivables += balance > 0 ? balance : 0;
        }

        // --- Row Color Logic ---
        let rowClass = "hover:bg-gray-100 dark:hover:bg-gray-700 transition"; // Default
        
        const isPaid = data.paymentStatus === "Fully Paid" || data.advanceReceived >= data.actualFee;
        const isDone = data.serviceStatus === "Done";
        const isNotCome = data.serviceStatus === "Not Come";

        if (isNotCome) {
            rowClass = "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100";
        } else if (isDone && isPaid) {
            rowClass = "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100";
        } else if (isPaid && !isDone) {
            rowClass = "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100";
        } else if (isDone && !isPaid) {
            rowClass = "bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100";
        } else {
            rowClass = "bg-white dark:bg-gray-800 " + rowClass;
        }

        // Format Date safely
        let reqDate = "N/A";
        if(data.date) {
            reqDate = new Date(data.date).toLocaleDateString('en-GB');
        }

        // Build Row
        const tr = document.createElement('tr');
        tr.className = rowClass;
        tr.innerHTML = `
            <td class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="font-mono text-xs font-bold mb-1 tracking-tight">${data.transactionId || "N/A"}</div>
                <div class="text-xs opacity-80"><i class="fa-regular fa-calendar text-brandTeal"></i> ${reqDate} | ${data.time || "N/A"}</div>
            </td>
            <td class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="font-bold text-sm">${data.patientName || "Unknown"} <span class="font-normal opacity-70">(${data.age||'-'} ${data.gender?data.gender.charAt(0):'-'})</span></div>
                <div class="text-xs opacity-80 truncate max-w-[150px] lg:max-w-xs" title="${data.complaint || "N/A"}">Comp: ${data.complaint || "N/A"}</div>
            </td>
            <td class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="text-sm font-bold text-brandTeal">${(data.branch || "N/A").replace("Theracare ", "").replace("Stracare ", "")}</div>
                <div class="text-xs font-medium opacity-80"><i class="fa-solid fa-user-doctor"></i> ${data.doctor || "Any"}</div>
            </td>
            <td class="p-4 border-b border-gray-200 dark:border-gray-700 font-mono text-xs">
                <div>Fee: ₹${data.actualFee}</div>
                <div class="text-green-600 dark:text-green-400">Adv: ₹${data.advanceReceived}</div>
                <div class="text-red-600 dark:text-red-400 font-bold">Bal: ₹${balance}</div>
            </td>
            <td class="p-4 border-b border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-wide">
                <div class="mb-1">SRV: <span class="${data.serviceStatus==='Done'?'text-green-600 dark:text-green-400': data.serviceStatus==='Not Come'?'text-red-600 dark:text-red-400':''}">${data.serviceStatus}</span></div>
                <div>PAY: <span class="${data.paymentStatus==='Fully Paid'?'text-blue-600 dark:text-blue-400':''}">${data.paymentStatus}</span></div>
            </td>
            <td class="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
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
}

// --- Modal Functions ---
const modal = document.getElementById('editModal');
const modalInner = modal.querySelector('div');

function openModal(id) {
    const data = allAppointments.find(d => d.id === id);
    if(!data) return;

    document.getElementById('editDocId').value = id;
    document.getElementById('displayPatientName').textContent = `${data.patientName} (${data.transactionId})`;
    
    document.getElementById('editServiceStatus').value = data.serviceStatus;
    document.getElementById('editPaymentStatus').value = data.paymentStatus;
    document.getElementById('editActualFee').value = data.actualFee;
    document.getElementById('editAdvance').value = data.advanceReceived;
    document.getElementById('editUpi').value = data.upiRef;

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
    }
}
