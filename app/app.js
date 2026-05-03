// Initialize Icons
lucide.createIcons();

// Mobile Menu Toggle
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (drawer.classList.contains('-translate-x-full')) {
        drawer.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

// Modal Logic
function openBooking() { 
  document.getElementById('bookingModal').classList.add('active'); 
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeBooking() { 
  document.getElementById('bookingModal').classList.remove('active'); 
  document.body.style.overflow = 'auto';
}

// Stepper Logic
function toStep2() {
    const name = document.getElementById('pName').value.trim();
    const phone = document.getElementById('pPhone').value.trim();
    const date = document.getElementById('appointDate').value;
    
    if(!name) { alert('Please enter the Patient Name'); return; }
    if(!phone) { alert('Please enter a Contact Number'); return; }
    if(!date) { alert('Please select a Date'); return; }
    
    document.getElementById('step1').classList.replace('step-active', 'step-hidden');
    document.getElementById('step2').classList.replace('step-hidden', 'step-active');
}

function toStep1() {
    document.getElementById('step2').classList.replace('step-active', 'step-hidden');
    document.getElementById('step1').classList.replace('step-hidden', 'step-active');
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

// Finalize via WhatsApp
function finishBooking() {
    const name = document.getElementById('pName').value;
    const phone = document.getElementById('pPhone').value;
    const branch = document.getElementById('pBranch').value;
    const rawDate = document.getElementById('appointDate').value;
    const time = document.getElementById('appointTime').value;
    const complaint = document.getElementById('pMessage').value || "Not specified";
    
    const formattedDate = formatDateToDDMMYYYY(rawDate);
    
    // Format WhatsApp Message
    const message = `*NEW BOOKING RECEIVED*%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Branch:* ${branch}%0A*Date:* ${formattedDate}%0A*Time:* ${time}%0A*Complaint:* ${complaint}%0A%0A*Status:* Payment Confirmed via UPI (accountree@ybl)%0A*Clinic:* Stra Care Physiotherapy`;
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/919946151111?text=${message}`, '_blank');
    
    closeBooking();
    
    // Reset form
    setTimeout(() => {
      toStep1();
      document.getElementById('pName').value = '';
      document.getElementById('pPhone').value = '';
      document.getElementById('appointDate').value = '';
      document.getElementById('pMessage').value = '';
    }, 500);
}

// Running Date and Time Function
function updateDateTime() {
    const now = new Date();
    
    // Format Date: DD-MM-YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Format Time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Update Desktop Nav
    const navDateEl = document.getElementById('navDate');
    const navTimeEl = document.getElementById('navTime');
    if (navDateEl) navDateEl.textContent = formattedDate;
    if (navTimeEl) navTimeEl.textContent = formattedTime;

    // Update Mobile Menu
    const menuDateEl = document.getElementById('menuDate');
    const menuTimeEl = document.getElementById('menuTime');
    if (menuDateEl) menuDateEl.textContent = formattedDate;
    if (menuTimeEl) menuTimeEl.textContent = formattedTime;
}

// Update time every second
setInterval(updateDateTime, 1000);

window.addEventListener('load', () => {
    // Initial call to set time immediately
    updateDateTime();
    
    // Set minimum date for the date picker to today
    const dateInput = document.getElementById('appointDate');
    if(dateInput) {
        const today = new Date().toISOString().split('T');
        dateInput.setAttribute('min', today);
    }
});
