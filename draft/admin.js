<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STRA CARE | Admin Dashboard</title>
    
    <link rel="icon" type="image/png" href="https://stracares.in/assets/logo-app.png">
    <meta name="theme-color" content="#ffffff">

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        tailwind.config = { 
            darkMode: 'class',
            theme: { extend: { colors: { brandTeal: '#009B95', brandNavy: '#1E3A5F', brandDark: '#0f172a' } } } 
        }
    </script>
    <style>
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        select, input { outline: none; }
    </style>

    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyDwfmoDPvslFmTn3GjO56VAxhODRlem5bg",
            authDomain: "stra-care.firebaseapp.com",
            projectId: "stra-care",
            storageBucket: "stra-care.firebasestorage.app",
            messagingSenderId: "329966100049",
            appId: "1:329966100049:web:ca8acc0fccdebac5da6270"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
    </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans antialiased flex h-screen overflow-hidden transition-colors duration-300">

    <!-- Login Overlay -->
    <div id="loginOverlay" class="fixed inset-0 bg-gray-900 flex items-center justify-center z-[100000] hidden">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
            <img src="https://stracares.in/assets/logo-header.png" alt="STRA CARE" class="h-12 object-contain mx-auto mb-6 bg-white px-2 rounded">
            <h2 class="text-xl font-bold text-brandNavy dark:text-white mb-6">Admin Login</h2>
            <form id="loginForm" class="space-y-4">
                <input type="email" id="loginEmail" required placeholder="Email Address" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brandTeal">
                <input type="password" id="loginPassword" required placeholder="Password" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-brandTeal">
                <button type="submit" class="w-full bg-brandTeal text-white font-bold py-3 rounded-lg shadow hover:bg-teal-700 transition">Login</button>
                <p id="loginError" class="text-red-500 text-sm hidden font-bold mt-2">Invalid Credentials</p>
            </form>
        </div>
    </div>

    <!-- Expandable Sidebar Menu (Dark Mirror Glassmorphism) -->
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity lg:hidden" onclick="toggleSidebar()"></div>
    <aside id="sidebar" class="bg-gray-900/90 backdrop-blur-xl w-64 h-full fixed lg:static transform -translate-x-full lg:translate-x-0 transition-transform duration-300 z-50 border-r border-gray-700 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.5)] text-gray-300">
        
        <!-- Sidebar Header: CMFiling Logo & License Details -->
        <div class="pt-8 pb-5 flex flex-col items-center justify-center border-b border-gray-700/50 shrink-0 relative">
            <img src="https://stracares.in/assets/logo-footer-cmf.png" alt="CMFilings" class="h-10 object-contain mb-3">
            <div class="text-center space-y-1">
                <p class="text-[10px] text-gray-400 font-mono tracking-wide">Licencee Name: <span class="text-white font-bold">Stra Care</span></p>
                <p class="text-[10px] text-gray-400 font-mono tracking-wide">Licence No: <span class="text-white font-bold">C427300400</span></p>
                <p class="text-[10px] text-gray-400 font-mono tracking-wide">Valid Till: <span class="text-white font-bold">30 April 2027</span></p>
            </div>
            <button onclick="toggleSidebar()" class="lg:hidden text-gray-400 hover:text-brandTeal text-2xl absolute top-4 right-4"><i class="fa-solid fa-xmark"></i></button>
        </div>
        
        <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar">
            
            <!-- User Account Info (Sidebar) -->
            <div class="flex items-center gap-3 px-3 py-3 mb-4 mt-2 bg-black/20 rounded-xl border border-gray-700/50">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #009B95, #F7CB51);">
                    <i class="fa-solid fa-user-shield text-white text-xs"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p id="sideUserRole" class="text-[10px] text-brandTeal uppercase tracking-widest font-bold">---</p>
                    <p id="sideUserEmail" class="text-xs font-bold text-white truncate">Not logged in</p>
                </div>
            </div>

            <a href="#" onclick="setGlobalView('All')" class="flex items-center gap-3 bg-brandTeal/20 text-brandTeal p-3 rounded-lg font-bold border border-brandTeal/30">
                <i class="fa-solid fa-chart-line w-5"></i> Dashboard Overview
            </a>
            
            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-6 px-2">Data Views</div>
            <a href="#" onclick="setGlobalView('Pending')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-regular fa-clock w-5 text-yellow-400"></i> Pending
            </a>
            <a href="#" onclick="setGlobalView('Completed')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-check-double w-5 text-green-400"></i> Completed
            </a>
            <a href="#" onclick="setGlobalView('Cancelled')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-ban w-5 text-red-400"></i> Cancelled
            </a>

            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-6 px-2">Modules</div>
            <a href="#" onclick="alert('Reports module is coming soon!')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-file-invoice w-5 text-blue-400"></i> Reports
            </a>
            <a href="#" onclick="alert('CRM module is coming soon!')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-users-gear w-5 text-purple-400"></i> CRM
            </a>
            <a href="#" onclick="alert('Statements module is coming soon!')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-receipt w-5 text-emerald-400"></i> Statements
            </a>
            
            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 mt-6 px-2">System</div>
            <a href="#" onclick="alert('App Details:\nLicence No: C427300400\nValid Till: 30 April 2027\nLicensed to: Stra Care')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-id-card w-5 text-gray-400"></i> App Details
            </a>
            <a href="#" onclick="alert('Help & Support module is coming soon!')" class="flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:text-white p-3 rounded-lg font-semibold transition">
                <i class="fa-solid fa-circle-question w-5 text-brandTeal"></i> Help & Support
            </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="p-6 border-t border-gray-700/50 bg-black/30 shrink-0">
            <div class="text-[10px] font-bold text-brandTeal mb-3 tracking-widest uppercase">App Version 1.0</div>
            <a href="https://wa.me/919946151111?text=Hello%20Developer,%20I%20need%20support%20for%20Stra%20Care%20Admin" target="_blank" class="flex items-center gap-2 text-xs text-white font-bold hover:underline mb-2">
                <i class="fa-brands fa-whatsapp text-green-500 text-lg"></i> Contact Developer
            </a>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative bg-gray-50 dark:bg-gray-900">
        
        <!-- Corporate Premium Light Top Navigation -->
        <nav class="bg-white dark:bg-gray-800 shadow-sm z-30 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-300 relative">
            <div class="px-4 sm:px-6 flex justify-between items-center h-20">
                
                <!-- Left: Mobile Toggle & Master Search -->
                <div class="flex items-center gap-3 flex-1">
                    <button onclick="toggleSidebar()" class="text-gray-600 dark:text-gray-300 hover:text-brandTeal text-2xl focus:outline-none lg:hidden">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <!-- Master Search Bar -->
                    <div class="relative w-full max-w-[200px] sm:max-w-xs">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i>
                        </div>
                        <input type="text" id="masterSearch" onkeyup="masterSearchTable()" placeholder="Search anything..." class="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brandTeal transition dark:text-white shadow-inner">
                    </div>
                </div>
                
                <!-- Center: Clean Stra Care Logo & Title -->
                <div class="flex flex-col items-center justify-center flex-[2] text-center hidden md:flex">
                    <img src="https://stracares.in/assets/logo-header.png" alt="STRA CARE" class="h-9 md:h-12 object-contain mb-1 dark:bg-white dark:px-2 dark:rounded">
                    <span class="text-[9px] md:text-[11px] font-bold text-brandTeal tracking-[0.15em] sm:tracking-[0.2em] uppercase">Administration Filing & Tracking</span>
                </div>
                
                <!-- Right: User Email, Logout, Theme -->
                <div class="flex items-center justify-end space-x-3 sm:space-x-4 flex-1">
                    <div class="hidden sm:flex flex-col text-right">
                        <span id="topUserEmail" class="text-xs font-bold text-brandNavy dark:text-white">Loading...</span>
                        <span id="topUserRole" class="text-[10px] font-bold text-brandTeal uppercase tracking-widest">---</span>
                    </div>
                    
                    <div class="h-8 w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div> <!-- Divider -->

                    <button onclick="handleLogout()" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition" title="Logout">
                        <i class="fa-solid fa-power-off text-lg"></i>
                    </button>
                    <button onclick="toggleTheme()" class="p-2 sm:p-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 shadow-inner hover:bg-gray-200 transition border border-gray-200 dark:border-gray-600">
                        <i id="themeIcon" class="fa-solid fa-moon"></i>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Scrollable Dashboard Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 pb-24">
            
            <!-- Dashboard Controls -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div>
                    <h1 class="text-2xl font-black text-brandNavy dark:text-white tracking-tight" id="viewTitle">DASHBOARD OVERVIEW</h1>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending slots automatically appear at the top.</p>
                </div>
                <div class="flex items-center gap-4 w-full md:w-auto">
                    <div class="text-[10px] sm:text-xs font-mono bg-brandLight dark:bg-gray-700 border border-brandTeal/30 text-brandTeal px-4 py-2 rounded shadow-sm hidden md:block text-right leading-tight tracking-wide" id="adminClock">
                        --/--/---- <br> --:--:--
                    </div>
                    <div class="w-full md:w-auto">
                        <label class="block text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Filter By Branch</label>
                        <select id="branchFilterMain" class="w-full md:w-56 border-2 border-brandTeal/50 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 dark:text-white text-sm font-semibold shadow-sm cursor-pointer outline-none transition hover:border-brandTeal focus:ring-2 focus:ring-brandTeal/50">
                            <option value="All">All Branches</option>
                            <option value="Stracare Kottayampoyil (Main)">Stracare Kottayampoyil (Main)</option>
                            <option value="Stracare Arayakool">Stracare Arayakool</option>
                            <option value="Theracare Pallikkuni">Theracare Pallikkuni</option>
                            <option value="Theracare Azhiyur">Theracare Azhiyur</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Dashboard Metric Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><i class="fa-solid fa-calendar-check text-5xl text-blue-500"></i></div>
                    <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block relative z-10">Total Bookings</span>
                    <span class="text-2xl sm:text-3xl font-black text-brandNavy dark:text-white relative z-10" id="dashTotal">0</span>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><i class="fa-solid fa-clock text-5xl text-yellow-500"></i></div>
                    <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block relative z-10">Service Pending</span>
                    <span class="text-2xl sm:text-3xl font-black text-brandNavy dark:text-white relative z-10" id="dashPending">0</span>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><i class="fa-solid fa-check-double text-5xl text-green-500"></i></div>
                    <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block relative z-10">Service Done</span>
                    <span class="text-2xl sm:text-3xl font-black text-brandNavy dark:text-white relative z-10" id="dashDone">0</span>
                </div>
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><i class="fa-solid fa-wallet text-5xl text-red-500"></i></div>
                    <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1 block relative z-10">Pending Receivables</span>
                    <span class="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 relative z-10" id="dashReceivables">₹0</span>
                </div>
            </div>

            <!-- Color Legend -->
            <div class="flex flex-wrap gap-4 mb-4 text-[11px] sm:text-xs font-semibold bg-white dark:bg-gray-800 p-3.5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 items-center">
                <span class="text-gray-400 uppercase tracking-widest text-[10px] mr-2">Legend:</span>
                <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-white dark:bg-gray-800 border border-gray-300"></div> Pending</span>
                <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-blue-50 dark:bg-blue-900 border border-blue-300"></div> Payment Done</span>
                <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-purple-50 dark:bg-purple-900 border border-purple-300"></div> Service Done</span>
                <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-green-50 dark:bg-green-900 border border-green-300"></div> Both Complete</span>
                <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-red-50 dark:bg-red-900 border border-red-300"></div> Cancelled / Not Come</span>
            </div>

            <!-- Data Table Container -->
            <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div class="overflow-x-auto pb-4">
                    <table class="w-full text-left text-sm whitespace-nowrap">
                        <thead class="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 align-top h-14">
                            <tr>
                                <th class="p-4 font-bold tracking-wide align-middle">Trn ID / Date</th>
                                <th class="p-4 font-bold tracking-wide align-middle">Patient / Mobile</th>
                                <th class="p-4 font-bold tracking-wide align-middle">Branch / Doctor</th>
                                <th class="p-4 font-bold tracking-wide align-middle">Fee / Adv / Bal</th>
                                <th class="p-4 font-bold tracking-wide align-middle">Status</th>
                                <th class="p-4 font-bold text-center tracking-wide align-middle">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody" class="divide-y divide-gray-200 dark:divide-gray-700">
                            <!-- Rows dynamically populated via JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Edit Modal -->
    <div id="editModal" class="fixed inset-0 bg-black/60 hidden items-center justify-center z-[99999] transition-opacity duration-300 opacity-0 px-4 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900 shrink-0">
                <h3 class="font-bold text-brandNavy dark:text-white text-lg">Update Appointment</h3>
                <button onclick="closeModal()" class="text-gray-500 hover:text-red-500 text-xl"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div class="p-6 space-y-5 overflow-y-auto">
                <input type="hidden" id="editDocId">
                
                <div class="bg-brandLight/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-start shadow-inner">
                    <div>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1" id="displayPatientMobile">Mobile: Loading...</p>
                        <p class="font-bold text-brandNavy dark:text-brandTeal text-base sm:text-lg" id="displayPatientName">Loading...</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Last Edited</p>
                        <p class="text-[11px] text-gray-500 font-mono" id="displayLastEdited">Never</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Service Status</label>
                        <select id="editServiceStatus" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brandTeal shadow-sm">
                            <option value="Pending">Pending</option>
                            <option value="Done">Done</option>
                            <option value="Not Come">Not Come</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Payment Status</label>
                        <select id="editPaymentStatus" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brandTeal shadow-sm">
                            <option value="Pending">Pending</option>
                            <option value="Advance">Advance</option>
                            <option value="Fully Paid">Fully Paid</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Actual Fee (₹)</label>
                        <input type="number" id="editActualFee" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brandTeal shadow-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Advance Received (₹)</label>
                        <input type="number" id="editAdvance" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brandTeal shadow-sm">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">UPI Transaction No.</label>
                    <input type="text" id="editUpi" placeholder="e.g. 31234567890" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 dark:text-white text-sm font-mono outline-none focus:ring-2 focus:ring-brandTeal shadow-sm">
                </div>
                
                <div class="mt-2 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button onclick="deleteRecord()" id="deleteBtn" class="text-xs text-red-500 hover:text-red-700 font-bold hidden bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded"><i class="fa-solid fa-trash mr-1"></i> Delete Record</button>
                </div>
            </div>

            <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900 shrink-0">
                <button onclick="closeModal()" class="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition shadow-sm">Cancel</button>
                <button onclick="saveUpdate()" class="px-5 py-2.5 text-sm font-bold text-white bg-brandTeal hover:bg-teal-700 rounded-lg shadow-md transition flex items-center gap-2">
                    <i class="fa-solid fa-floppy-disk"></i> Save Data
                </button>
            </div>
        </div>
    </div>

    <!-- Script connected -->
    <script src="./admin.js"></script>
</body>
</html>
