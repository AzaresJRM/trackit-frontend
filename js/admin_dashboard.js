// Firestore real-time dashboard (no backend API needed)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firestore (assumes firebase has been initialized in your HTML)
    const db = firebase.firestore();

    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    const topBarTitle = document.querySelector('.top-bar-title');
    const sectionTitles = [
        'Dashboard',
        'Manage Users',
        'Offices',
        'Documents',
        'Reports',
        'Logs',
        'Settings'
    ];

    // Section containers
    const dashboardSection = document.querySelector('.stats-cards').parentElement;
    const usersSection = document.querySelector('.users-section');
    const officesSection = document.querySelector('.offices-section');
    const sectionElements = [
        dashboardSection,
        usersSection,
        officesSection
        // Add more as needed
    ];

    sidebarLinks.forEach((link, idx) => {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (topBarTitle) topBarTitle.textContent = sectionTitles[idx];
            sectionElements.forEach((sec, i) => {
                if (sec) sec.style.display = (i === idx) ? 'block' : 'none';
            });
        });
    });

    // --- DASHBOARD STATS (REAL-TIME) ---
    let users = [];
    let offices = [];
    let documents = [];
    let logs = [];

    async function fetchData() {
        try {
            const [usersRes, officesRes, documentsRes, logsRes] = await Promise.all([
                fetch('http://localhost:3000/api/users'),
                fetch('http://localhost:3000/api/offices'),
                fetch('http://localhost:3000/api/documents'),
                fetch('http://localhost:3000/api/logs')
            ]);
            users = await usersRes.json();
            offices = await officesRes.json();
            documents = await documentsRes.json();
            logs = await logsRes.json();
            updateStatsAndActivity();
            renderUsersTable();
            renderOfficesTable();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function updateStatsAndActivity() {
        // Completed docs: status === 'Completed'
        const completedDocs = Array.isArray(documents) ? documents.filter(d => d.status && d.status.toLowerCase() === 'completed').length : 0;
        // Only count one user per office
        const uniqueOfficeUserIds = new Set(users.map(u => u.office_id));
        document.querySelector('.stats-card:nth-child(1) .stats-value').textContent = documents.length || 0;
        document.querySelector('.stats-card:nth-child(2) .stats-value').textContent = uniqueOfficeUserIds.size || 0;
        document.querySelector('.stats-card:nth-child(3) .stats-value').textContent = offices.length || 0;
        document.querySelector('.stats-card:nth-child(4) .stats-value').textContent = completedDocs || 0;

        // Update logs/activity table
        const tbody = document.querySelector('.main-table tbody');
        tbody.innerHTML = '';
        if (!logs || logs.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" style="text-align:center;color:#888;">No activity yet</td>`;
            tbody.appendChild(tr);
        } else {
            logs.forEach(log => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${log.timestamp ? log.timestamp.split('T')[0] : ''}</td>
                    <td>${log.user_id || ''}</td>
                    <td>${log.action_type || ''}</td>
                    <td>${log.action_details || ''}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

    // Real-time listeners for dashboard
    fetchData();

    // --- USERS REAL-TIME TABLE ---
    function renderUsersTable() {
        const tbody = document.querySelector('#usersTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.office_id || ''}</td>
                <td>${user.role || ''}</td>
                <td>${user.is_active ? 'Yes' : 'No'}</td>
                <td>
                    <button onclick="window.editUser && window.editUser('${user.id}')">Edit</button>
                    <button onclick="window.deleteUser && window.deleteUser('${user.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    window.deleteUser = async function(id) {
        if (confirm('Delete this user?')) {
            await fetch(`http://localhost:3000/api/users/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };
    document.getElementById('addUserBtn').onclick = async function() {
        const username = prompt('Username?');
        const office_id = prompt('Office ID?');
        const role = prompt('Role?');
        if (username && office_id && role) {
            await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, office_id, role, is_active: true })
            });
            fetchData();
        }
    };

    // --- OFFICES REAL-TIME TABLE ---
    function renderOfficesTable() {
        const tbody = document.querySelector('#officesTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        offices.forEach(office => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${office.office_name}</td>
                <td>${office.office_code}</td>
                <td>${office.description || ''}</td>
                <td>${office.is_active ? 'Yes' : 'No'}</td>
                <td>
                    <button onclick="window.editOffice && window.editOffice('${office.id}')">Edit</button>
                    <button onclick="window.deleteOffice && window.deleteOffice('${office.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    window.deleteOffice = async function(id) {
        if (confirm('Delete this office?')) {
            await fetch(`http://localhost:3000/api/offices/${id}`, { method: 'DELETE' });
            fetchData();
        }
    };
    document.getElementById('addOfficeBtn').onclick = async function() {
        const office_name = prompt('Office Name?');
        const office_code = prompt('Office Code?');
        const description = prompt('Description?');
        if (office_name && office_code) {
            await fetch('http://localhost:3000/api/offices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ office_name, office_code, description, is_active: true })
            });
            fetchData();
        }
    };

    // --- LOGOUT MODAL LOGIC ---
    const logoutLink = document.getElementById('logoutLink');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutLink && logoutModal && cancelLogout && confirmLogout) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutModal.style.display = 'flex';
        });
        cancelLogout.addEventListener('click', function() {
            logoutModal.style.display = 'none';
        });
        confirmLogout.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        logoutModal.addEventListener('click', function(e) {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }
}); 