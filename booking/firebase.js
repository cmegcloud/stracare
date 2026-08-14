// Firebase Initialization
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";  
    import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";  

    const firebaseConfig = {  
        apiKey: "AIzaSyAcO1L2Za7dzILxylmMkRTSx0FBVu_EEoM",  
        authDomain: "cmf001stra.firebaseapp.com",  
        projectId: "cmf001stra",  
        storageBucket: "cmf001stra.firebasestorage.app",  
        messagingSenderId: "763958641347",  
        appId: "1:763958641347:web:316876bc2340b26bd21876",  
        measurementId: "G-770FBR88LJ"  
    };  

    const app = initializeApp(firebaseConfig);  
    const db = getFirestore(app);

    window.lucide.createIcons();
    
    // Fetch Branches from Firestore dynamically
    async function loadBranches() {
        const branchSelect = document.getElementById('pat_branch');
        try {
            const bSnap = await getDocs(collection(db, "branches"));
            branchSelect.innerHTML = '<option value="" disabled selected>Choose Clinic Branch...</option>';
            bSnap.forEach(doc => {
                const bData = doc.data();
                if (bData.name) {
                    const opt = document.createElement('option');
                    opt.value = bData.name;
                    opt.textContent = bData.name;
                    branchSelect.appendChild(opt);
                }
            });
        } catch (error) {
            console.error("Error loading branches: ", error);
            branchSelect.innerHTML = '<option value="" disabled selected>Error loading branches. Try again later.</option>';
        }
    }

    // Time Validation Function
    function validateDateTime() {
        const dateInput = document.getElementById("pat_date");
        const timeInput = document.getElementById("pat_time");
        if (!dateInput || !timeInput) return;

        const now = new Date();
        const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

        if (dateInput.value === todayStr) {
            const currentHour = String(now.getHours()).padStart(2, '0');
            const currentMin = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${currentHour}:${currentMin}`;
            
            timeInput.setAttribute('min', currentTimeStr);
            if (timeInput.value && timeInput.value < currentTimeStr) {
                timeInput.value = '';
                alert('Cannot select a past time for today.');
            }
        } else {
            timeInput.removeAttribute('min');
        }
    }

    // Initialize Listeners & Fix Bugs
    document.addEventListener("DOMContentLoaded", () => {
        // Prevent Past Dates in Date Picker
        const dateInput = document.getElementById("pat_date");
        const timeInput = document.getElementById("pat_time");
        if (dateInput) {
            const now = new Date();
            const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
            dateInput.setAttribute('min', todayStr);
            
            dateInput.addEventListener('change', validateDateTime);
            timeInput.addEventListener('change', validateDateTime);
        }
        
        // Load Dynamic Branches
        loadBranches();
        
        // Remove Splash
        setTimeout(() => { 
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.style.opacity = '0'; 
                setTimeout(() => splash.remove(), 600); 
            }
        }, 2000);
    });

    // Firebase: Verify Patient Mobile
    document.getElementById('verifyBtn').addEventListener('click', async () => {
        const mobile = document.getElementById('pat_mobile').value;
        const btn = document.getElementById('verifyBtn');

        if (mobile.length !== 10) return alert("Please enter a valid 10-digit mobile number.");
        
        btn.innerText = "...";
        try {
            const pSnap = await getDocs(query(collection(db, "patients"), where("mobile", "==", mobile)));
            if (!pSnap.empty) {
                const pData = pSnap.docs[0].data();
                document.getElementById('pat_name').value = pData.name || '';
                document.getElementById('pat_age').value = pData.age || '';
                document.getElementById('pat_address').value = pData.location || '';
                alert("Patient details found & auto-filled!");
            } else {
                alert("No prior records found. Please fill in your details to register.");
            }
        } catch (e) {
            console.error(e);
            alert("Error checking records.");
        }
        btn.innerText = "Check";
    });

    // Firebase: Submit Appointment Form
    document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitAppBtn');
        submitBtn.innerHTML = `Processing...`;
        submitBtn.disabled = true;

        const date = document.getElementById('pat_date').value;
        const time = document.getElementById('pat_time').value;
        const mobile = document.getElementById('pat_mobile').value;
        const name = document.getElementById('pat_name').value;
        const age = document.getElementById('pat_age').value;
        const address = document.getElementById('pat_address').value;
        const branch = document.getElementById('pat_branch').value;
        const notes = document.getElementById('pat_notes').value;
        
        // Handle Symptom mapping
        const symptomVal = document.getElementById('pat_symptom').value;
        const customSymptomVal = document.getElementById('pat_symptom_custom').value;
        const finalSymptom = (symptomVal === 'Other') ? customSymptomVal : symptomVal;

        const payload = {
            mobile: mobile,
            name: name,
            age: age,
            location: address,
            symptom: finalSymptom,
            patientNotes: notes,
            branch: branch,
            date: date,
            time: time,
            therapist: "Unassigned", // To be filled by Admin
            status: "Pending",       // Awaiting Admin Action
            fee: 0,
            advance: 0,
            balance: 0,
            prevDues: 0,
            notes: "Booked via App",
            "#TimeStamp": new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        try {
            // Check & Register new patient if needed
            const pSnap = await getDocs(query(collection(db, "patients"), where("mobile", "==", mobile)));
            if (pSnap.empty) {
                const genId = "P" + Math.floor(Math.random() * 90000 + 10000);
                await addDoc(collection(db, "patients"), { 
                    patientId: genId, mobile: mobile, name: name, age: age, location: address, notes: notes, branch: branch, createdAt: new Date() 
                });
            }

            // Save Appointment
            const docRef = await addDoc(collection(db, "appointments"), payload);
            
            // Format Ticket Data
            const refNo = "APT-" + docRef.id.substring(0, 5).toUpperCase();
            const indDate = date.split('-').reverse().join('/') + ' at ' + time;
            
            document.getElementById('tkt_ref').innerText = refNo;
            document.getElementById('tkt_name').innerText = name;
            document.getElementById('tkt_datetime').innerText = indDate;
            document.getElementById('tkt_branch').innerText = branch;

            // Reset & Show Success
            document.getElementById('appointmentForm').reset();
            window.toggleCustomSymptom(); // Reset dropdown field
            closeAllModals(true); // Close but don't reset buttons just yet
            document.getElementById('success-popup').classList.add('active');

        } catch(error) {
            console.error(error);
            alert("Failed to save booking. Please check your network.");
        }
        
        submitBtn.innerHTML = `Proceed to Submit <i data-lucide="check-circle"></i>`;
        submitBtn.disabled = false;
        window.lucide.createIcons();
    });
