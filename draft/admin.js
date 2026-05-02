<!doctype html>
<html lang="en" class="h-full w-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>STRA CARE | Admin ERP</title>
  
  <meta name="theme-color" content="#5453EC">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="icon" type="image/png" href="https://stracares.in/assets/logo-app.png">

  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <script>
    tailwind.config = {
      darkMode: 'class', 
      theme: {
        extend: { 
            fontFamily: { jakarta: ['Plus Jakarta Sans', 'sans-serif'], },
            colors: { brandTeal: '#009B95', brandNavy: '#1E3A5F' }
        }
      }
    }
  </script>
  <style>
    * { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
    html, body { max-width: 100vw; overflow-x: hidden; }
    
    .sidebar-transition { transition: transform 0.3s ease-in-out; }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
    
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

    input:focus, select:focus, textarea:focus { border-color: #009B95 !important; outline: none; box-shadow: 0 0 0 2px rgba(0, 155, 149, 0.2); }
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
<body class="h-full bg-slate-50 dark:bg-slate-900 overflow-hidden w-full relative transition-colors duration-300">

  <!-- Login Overlay (Themed) -->
  <div id="loginOverlay" class="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100000] fade-in hidden">
      <div class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-slate-200 dark:border-slate-700">
          <img src="https://stracares.in/assets/logo-header.png" alt="STRA CARE" class="h-12 object-contain mx-auto mb-6 bg-slate-50 dark:bg-white px-3 py-1 rounded-xl shadow-sm">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-6">Secure ERP Login</h2>
          <form id="loginForm" class="space-y-4">
              <input type="email" id="loginEmail" required placeholder="Email Address" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white outline-none">
              <input type="password" id="loginPassword" required placeholder="Password" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white outline-none">
              <button type="submit" class="w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95" style="background: linear-gradient(135deg, #009B95, #007A75);">Login to Dashboard</button>
              <p id="loginError" class="text-red-500 text-sm hidden font-bold mt-2">Invalid Credentials</p>
          </form>
      </div>
  </div>

  <div id="app" class="h-full flex w-full relative overflow-hidden">
    
    <!-- Mobile Sidebar Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 hidden lg:hidden opacity-0 transition-opacity" onclick="toggleSidebar()"></div>

    <!-- Sidebar -->
    <aside id="sidebar" class="sidebar-transition bg-slate-900 h-full w-72 flex flex-col shadow-2xl fixed lg:relative z-50 transform -translate-x-full lg:translate-x-0 shrink-0">
      
      <!-- Sidebar Header -->
      <div class="p-6 border-b border-slate-700/50 flex items-center justify-between shrink-0">
        <a href="https://www.cmfiling.com" target="_blank" class="hover:opacity-80 transition block bg-black/20 border border-yellow-500/50 px-4 py-2 rounded-lg shadow-inner">
            <img src="https://stracares.in/assets/logo-footer-cmf.png" alt="CMFilings" class="h-5 object-contain">
        </a>
        <button onclick="toggleSidebar()" class="lg:hidden text-slate-400 hover:text-white text-xl"><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <!-- Logged In User Info -->
      <div class="p-4 mx-4 mt-4 bg-slate-800/50 rounded-xl border border-slate-700/50 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #009B95, #F7CB51);">
            <i class="fa-solid fa-user-shield text-white"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p id="topUserRole" class="text-[10px] text-slate-400 uppercase tracking-wider font-bold">---</p>
            <p id="topUserEmail" class="text-sm font-bold text-white truncate">Not logged in</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto w-full">
        <ul class="space-y-2 w-full">
          <li>
            <button onclick="setGlobalView('All')" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white mb-4 shadow-lg transition-transform active:scale-95" style="background: linear-gradient(135deg, #009B95, #007A75);">
              <i class="fa-solid fa-chart-line w-5"></i>
              <span class="font-bold text-sm tracking-wide">Overview</span>
            </button>
          </li>
          
          <div class="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest px-2 mb-2 mt-4">Filing Views</div>
          
          <li>
            <button onclick="setGlobalView('Pending')" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group">
              <i class="fa-regular fa-clock w-5 text-yellow-400 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium text-sm">Pending Slots</span>
            </button>
          </li>
          <li>
            <button onclick="setGlobalView('Completed')" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group">
              <i class="fa-solid fa-check-double w-5 text-green-400 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium text-sm">Completed Slots</span>
            </button>
          </li>
          <li>
            <button onclick="setGlobalView('Cancelled')" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group">
              <i class="fa-solid fa-ban w-5 text-red-400 group-hover:scale-110 transition-transform"></i>
              <span class="font-medium text-sm">Cancelled / Not Come</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-slate-700/50 shrink-0 bg-slate-900">
        <div class="text-[10px] font-bold text-brandTeal mb-2 tracking-widest uppercase px-2">App Version 1.0</div>
        <button onclick="handleLogout()" class="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors font-bold text-sm mb-2">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
        <a href="https://wa.me/919946151111?text=Hello%20Developer,%20I%20need%20support%20for%20Stra%20Care%20Admin" target="_blank" class="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors text-sm">
            <i class="fa-brands fa-whatsapp text-green-500 text-lg"></i> Developer Support
        </a>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 h-full flex flex-col relative min-w-0 transition-colors duration-300">
      
      <!-- Top Header -->
      <header class="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-4 py-4 flex items-center justify-between z-10 shrink-0 transition-colors duration-300">
        
        <div class="flex items-center gap-3 flex-1">
          <button onclick="toggleSidebar()" class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors lg:hidden">
            <i class="fa-solid fa-bars text-lg"></i>
          </button>
          
          <!-- Master Search -->
          <div class="relative w-full max-w-[200px] sm:max-w-xs">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa-solid fa-magnifying-glass text-slate-400 text-sm"></i>
              </div>
              <input type="text" id="masterSearch" onkeyup="masterSearchTable()" placeholder="Search records..." class="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-brandTeal outline-none transition dark:text-white">
          </div>
        </div>
        
        <div class="hidden md:flex flex-col items-center justify-center flex-[2] text-center">
            <img src="https://stracares.in/assets/logo-header.png" alt="STRA CARE" class="h-8 lg:h-10 object-contain mb-1 dark:bg-white dark:px-2 dark:rounded">
            <span class="text-[9px] font-bold text-brandTeal tracking-[0.2em] uppercase">Administration & Tracking</span>
        </div>

        <div class="flex items-center justify-end gap-3 flex-1">
          <div class="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
            <i class="fa-regular fa-clock text-brandTeal"></i>
            <span class="text-sm font-semibold text-slate-600 dark:text-slate-300 font-mono" id="adminClock">--:--:--</span>
          </div>
          <button onclick="toggleTheme()" class="p-2.5 rounded-xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-yellow-400 hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors shadow-sm border border-indigo-100 dark:border-slate-600">
            <i id="themeIcon" class="fa-solid fa-moon"></i>
          </button>
        </div>
      </header>

      <!-- Scrollable Workspace -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 w-full relative pb-24">
        
        <div class="fade-in w-full">
            
          <!-- Controls Header -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
              <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight" id="viewTitle">Overview</h1>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Pending slots automatically rank at the top.</p>
              </div>
              <div class="w-full md:w-auto">
                  <select id="branchFilterMain" class="w-full md:w-64 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-700 dark:text-white text-sm font-bold shadow-sm cursor-pointer outline-none transition focus:border-brandTeal">
                      <option value="All">Global - All Branches</option>
                      <option value="Stracare Kottayampoyil (Main)">Stracare Kottayampoyil (Main)</option>
                      <option value="Stracare Arayakool">Stracare Arayakool</option>
                      <option value="Theracare Pallikkuni">Theracare Pallikkuni</option>
                      <option value="Theracare Azhiyur">Theracare Azhiyur</option>
                  </select>
              </div>
          </div>

          <!-- Dashboard Metric Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fa-solid fa-calendar-check text-5xl text-[#5453EC]"></i></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #5453EC, #6B63FF);">
                  <i class="fa-solid fa-users text-lg"></i>
                </div>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white relative z-10" id="dashTotal">0</h3>
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 relative z-10">Total Bookings</p>
            </div>
            
            <div class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fa-solid fa-clock text-5xl text-yellow-500"></i></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #F7CB51, #FCD34D);">
                  <i class="fa-solid fa-hourglass-half text-lg"></i>
                </div>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white relative z-10" id="dashPending">0</h3>
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 relative z-10">Service Pending</p>
            </div>

            <div class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fa-solid fa-check-double text-5xl text-emerald-500"></i></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #10b981, #34d399);">
                  <i class="fa-solid fa-clipboard-check text-lg"></i>
                </div>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white relative z-10" id="dashDone">0</h3>
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 relative z-10">Service Done</p>
            </div>

            <div class="card-hover bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10"><i class="fa-solid fa-wallet text-5xl text-red-500"></i></div>
              <div class="flex items-center justify-between mb-4 relative z-10">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style="background: linear-gradient(135deg, #EF4444, #F87171);">
                  <i class="fa-solid fa-indian-rupee-sign text-lg"></i>
                </div>
              </div>
              <h3 class="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 relative z-10" id="dashReceivables">₹0</h3>
              <p class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1 relative z-10">Receivables</p>
            </div>
          </div>

          <!-- Color Legend -->
          <div class="flex flex-wrap gap-4 mb-4 text-[11px] sm:text-xs font-bold bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 items-center">
              <span class="text-slate-400 uppercase tracking-widest text-[10px] mr-2"><i class="fa-solid fa-circle-info mr-1"></i> Legend:</span>
              <span class="flex items-center gap-1.5"><div class="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-500"></div> Pending</span>
              <span class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300"><div class="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-500"></div> Payment Done</span>
              <span class="flex items-center gap-1.5 text-purple-700 dark:text-purple-300"><div class="w-3 h-3 rounded bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-500"></div> Service Done</span>
              <span class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><div class="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-500"></div> Fully Complete</span>
              <span class="flex items-center gap-1.5 text-red-700 dark:text-red-300"><div class="w-3 h-3 rounded bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500"></div> Cancelled</span>
          </div>

          <!-- Data Table -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors overflow-hidden">
            <div class="overflow-x-auto pb-4">
              <table class="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th class="p-4 font-semibold whitespace-nowrap">Trn ID / Date</th>
                    <th class="p-4 font-semibold whitespace-nowrap">Patient Details</th>
                    <th class="p-4 font-semibold whitespace-nowrap">Branch / Doctor</th>
                    <th class="p-4 font-semibold whitespace-nowrap">Financials (₹)</th>
                    <th class="p-4 font-semibold whitespace-nowrap">Status</th>
                    <th class="p-4 font-semibold whitespace-nowrap text-center">Action</th>
                  </tr>
                </thead>
                <tbody id="tableBody" class="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                    <tr><td colspan="6" class="p-10 text-center text-slate-400 font-medium animate-pulse">Syncing Secure Data...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>

  <!-- Edit Modal (ERP Themed) -->
  <div id="editModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4 z-[99999] opacity-0 transition-opacity duration-300">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-0 w-full max-w-lg transform scale-95 transition-transform duration-300 overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700" id="modalInner">
          
          <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-brandTeal/20 text-brandTeal flex items-center justify-center"><i class="fa-solid fa-pen"></i></div>
                  <h3 class="font-bold text-slate-800 dark:text-white text-lg">Manage Record</h3>
              </div>
              <button onclick="closeModal()" class="text-slate-400 hover:text-red-500 text-xl transition-colors"><i class="fa-solid fa-xmark"></i></button>
          </div>
          
          <div class="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              <input type="hidden" id="editDocId">
              
              <div class="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 flex justify-between items-start">
                  <div>
                      <p class="text-[10px] text-[#5453EC] dark:text-indigo-400 uppercase tracking-widest font-bold mb-1" id="displayPatientMobile">Mobile: Loading...</p>
                      <p class="font-bold text-slate-800 dark:text-white text-lg" id="displayPatientName">Loading...</p>
                  </div>
                  <div class="text-right">
                      <p class="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Last Edited</p>
                      <p class="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold" id="displayLastEdited">Never</p>
                  </div>
              </div>

              <div class="grid grid-cols-2 gap-5">
                  <div>
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Service Status</label>
                      <select id="editServiceStatus" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm outline-none transition-shadow">
                          <option value="Pending">Pending</option>
                          <option value="Done">Done</option>
                          <option value="Not Come">Not Come</option>
                          <option value="Cancelled">Cancelled</option>
                      </select>
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Payment Status</label>
                      <select id="editPaymentStatus" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm outline-none transition-shadow">
                          <option value="Pending">Pending</option>
                          <option value="Advance">Advance</option>
                          <option value="Fully Paid">Fully Paid</option>
                          <option value="Refunded">Refunded</option>
                      </select>
                  </div>
              </div>

              <div class="grid grid-cols-2 gap-5">
                  <div>
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Actual Fee (₹)</label>
                      <input type="number" id="editActualFee" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm outline-none transition-shadow font-mono font-bold">
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">Advance Rcvd (₹)</label>
                      <input type="number" id="editAdvance" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm outline-none transition-shadow font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  </div>
              </div>

              <div>
                  <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase">UPI Transaction No.</label>
                  <input type="text" id="editUpi" placeholder="e.g. 31234567890" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm font-mono outline-none transition-shadow">
              </div>
              
              <div class="mt-2 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                  <button onclick="deleteRecord()" id="deleteBtn" class="text-xs text-red-600 hover:text-white font-bold hidden bg-red-50 hover:bg-red-500 dark:bg-red-900/20 dark:hover:bg-red-600 px-4 py-2 rounded-lg transition-colors border border-red-200 dark:border-red-800"><i class="fa-solid fa-trash mr-1"></i> Delete Permanent</button>
              </div>
          </div>

          <div class="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <button onclick="closeModal()" class="px-5 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
              <button onclick="saveUpdate()" class="px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2" style="background: linear-gradient(135deg, #009B95, #007A75);">
                  <i class="fa-solid fa-floppy-disk"></i> Update Data
              </button>
          </div>
      </div>
  </div>

  <!-- Main Application Script -->
  <script src="./admin.js"></script>
</body>
</html>
