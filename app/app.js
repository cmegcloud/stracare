// ==========================================
// Theme Initialization
// ==========================================
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const iconD = document.getElementById('themeIcon');
    const iconM = document.getElementById('themeIconMobile');
    if(isDark) {
        if(iconD) { iconD.className = "fa-solid fa-sun"; iconD.parentElement.classList.add('text-yellow-400'); }
        if(iconM) { iconM.className = "fa-solid fa-sun"; iconM.parentElement.classList.add('text-yellow-400'); }
    } else {
        if(iconD) { iconD.className = "fa-solid fa-moon"; iconD.parentElement.classList.remove('text-yellow-400'); }
        if(iconM) { iconM.className = "fa-solid fa-moon"; iconM.parentElement.classList.remove('text-yellow-400'); }
    }
}

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    window.addEventListener('DOMContentLoaded', () => {
        const iconD = document.getElementById('themeIcon');
        const iconM = document.getElementById('themeIconMobile');
        if(iconD) { iconD.className = "fa-solid fa-sun"; iconD.parentElement.classList.add('text-yellow-400'); }
        if(iconM) { iconM.className = "fa-solid fa-sun"; iconM.parentElement.classList.add('text-yellow-400'); }
    });
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
function toggleMobileMenu() {
    const o = document.getElementById('mobileMenuOverlay'), d = document.getElementById('mobileDrawer');
    if (o.classList.contains('hidden')) { 
        o.classList.remove('hidden'); 
        setTimeout(() => { o.classList.remove('opacity-0'); d.classList.remove('-translate-x-full'); }, 10); 
    } else { 
        o.classList.add('opacity-0'); 
        d.classList.add('-translate-x-full'); 
        setTimeout(() => { o.classList.add('hidden'); }, 300); 
    }
}

// ==========================================
// Utility functions
// ==========================================
function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'STRA CARE Physiotherapy',
            text: 'Recover Better. Move Better. Live Better. Explore specialized physiotherapy at STRA CARE. Book your consultation online today!',
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Copy this link to share: " + window.location.href);
    }
}

// Format date from YYYY-MM-DD to DD-MM-YYYY
function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts}-${parts}-${parts}`;
    }
    return dateString;
}

// Running Date and Time Function
function updateDateTime() {
    const now = new Date();
    
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const navDateEl = document.getElementById('navDate');
    const navTimeEl = document.getElementById('navTime');
    if (navDateEl) navDateEl.textContent = formattedDate;
    if (navTimeEl) navTimeEl.textContent = formattedTime;

    const menuDateEl = document.getElementById('menuDate');
    const menuTimeEl = document.getElementById('menuTime');
    if (menuDateEl) menuDateEl.textContent = formattedDate;
    if (menuTimeEl) menuTimeEl.textContent = formattedTime;
}

setInterval(updateDateTime, 1000);

// ==========================================
// Setup on Load
// ==========================================
window.addEventListener('load', () => { 
    updateDateTime();
    
    const year = new Date().getFullYear();
    if(document.getElementById('currentYearFooter')) document.getElementById('currentYearFooter').textContent = year;
    if(document.getElementById('currentYearMenu')) document.getElementById('currentYearMenu').textContent = year;

    const dateInput = document.getElementById('appointDate');
    if(dateInput) {
        const today = new Date().toISOString().split('T');
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
});

// ==========================================
// Booking Logic (Full Firebase + UPI Payload)
// ==========================================
async function initiatePayment() {
    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const age = document.getElementById('patientAge').value;
    const gender = document.getElementById('patientGender').value;
    const complaint = document.getElementById('patientComplaint').value;
    
    const prevTreatmentEl = document.getElementById('patientPrevTreatment');
    const prevTreatment = prevTreatmentEl && prevTreatmentEl.value.trim() !== "" ? prevTreatmentEl.value : "None";

    const branch = document.getElementById('branchSelect').value;
    const doctor = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointDate').value;
    const time = document.getElementById('appointTime').value;
    const amount = document.getElementById('paymentAmount').value;

    if(!name || !phone || !age || !gender || !complaint || !date || !time) {
        return alert("Please fill all required patient details.");
    }
    if(!amount || amount <= 0) {
        return alert("Please enter a valid payment amount.");
    }

    const btn = document.getElementById('payBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Booking...';
    btn.disabled = true;

    const formattedDate = formatDateToDDMMYYYY(date);
    const d = new Date();
    const dateString = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const transactionRef = "SC" + dateString + Math.floor(100 + Math.random() * 900);
    
    const upiId = "accountree@ybl";

    try {
        await db.collection("appointments").add({
            transactionId: transactionRef, 
            patientName: name, 
            phone: phone, 
            age: age, 
            gender: gender, 
            complaint: complaint, 
            previousTreatment: prevTreatment,
            branch: branch, 
            doctor: doctor, 
            date: formattedDate, 
            time: time, 
            amount: Number(amount), 
            status: "pending", 
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        document.getElementById('statusMsg').textContent = "Booking saved! Redirecting to UPI...";
        document.getElementById('statusMsg').className = "mt-4 text-sm font-bold text-center text-green-500";
        document.getElementById('statusMsg').classList.remove('hidden');

        setTimeout(() => {
            window.location.href = `upi://pay?pa=${upiId}&pn=STRA%20CARE&tr=${transactionRef}&am=${amount}.00&cu=INR&tn=Consultation`;
            btn.innerHTML = '<i class="fa-solid fa-qrcode"></i> Proceed via UPI';
            btn.disabled = false;
        }, 1500);

    } catch (error) {
        console.error("Firebase Add Error:", error);
        alert("Error saving booking. Please check your internet connection.");
        btn.innerHTML = '<i class="fa-solid fa-qrcode"></i> Proceed via UPI';
        btn.disabled = false;
    }
}
