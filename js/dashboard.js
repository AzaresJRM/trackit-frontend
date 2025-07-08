console.log('DASHBOARD JS LOADED');

window.loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

document.addEventListener('DOMContentLoaded', async () => {
    const logoutLink = document.getElementById('logoutLink');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutLink && logoutModal && cancelLogout && confirmLogout) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.style.display = 'block';
        });

        cancelLogout.addEventListener('click', () => {
            logoutModal.style.display = 'none';
        });

        confirmLogout.addEventListener('click', () => {
            window.location.href = 'index.html'; // Redirect to login page
        });

        // Close the modal if the user clicks outside of it
        window.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            location.reload(); // Reload the entire page
        });
    }

    // Modal logic for New Documents
    const newDocumentModal = document.getElementById('newDocumentModal');
    const cancelNewDoc = document.getElementById('cancelNewDoc');
    const newDocBtn = document.querySelector('.new-doc-btn');

    if (newDocBtn && newDocumentModal && cancelNewDoc) {
        newDocBtn.addEventListener('click', () => {
            newDocumentModal.style.display = 'flex';
        });
        cancelNewDoc.addEventListener('click', () => {
            newDocumentModal.style.display = 'none';
        });
        newDocumentModal.addEventListener('click', (e) => {
            if (e.target === newDocumentModal) {
                newDocumentModal.style.display = 'none';
            }
        });
    }

    // Modal logic for Update Documents
    const updateDocumentModal = document.getElementById('updateDocumentModal');
    const cancelUpdateDoc = document.getElementById('cancelUpdateDoc');
    const updateDocumentForm = document.getElementById('updateDocumentForm');

    if (updateDocumentModal && cancelUpdateDoc && updateDocumentForm) {
        cancelUpdateDoc.addEventListener('click', () => {
            updateDocumentModal.style.display = 'none';
        });

        updateDocumentModal.addEventListener('click', (e) => {
            if (e.target === updateDocumentModal) {
                updateDocumentModal.style.display = 'none';
            }
        });

        updateDocumentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your logic to handle document update here
            alert('Document updated! (Demo)');
            updateDocumentModal.style.display = 'none';
        });
    }

    // Event listeners for action buttons to open update modal
    const actionButtons = document.querySelectorAll('.action-btn');

    if (actionButtons.length > 0 && updateDocumentModal && cancelUpdateDoc && updateDocumentForm) {
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const card = button.closest('.document-card');
                if (card) {
                    const requisitioner = card.querySelector('.card-row:nth-child(1) .value').textContent.trim();
                    const title = card.querySelector('.card-row:nth-child(2) .value').textContent.trim();
                    const content = card.querySelector('.card-row:nth-child(3) .value').textContent.trim();
                    const type = card.querySelector('.card-row:nth-child(4) .value').textContent.trim();

                    document.getElementById('updateRequisitioner').value = requisitioner;
                    document.getElementById('updateTitle').value = title;
                    document.getElementById('updateContent').value = content;
                    document.getElementById('updateType').value = type;

                    updateDocumentModal.style.display = 'flex';
                } else {
                    alert('No documents found to update.');
                }
            });
        });
    }

    // Section management and navigation
    const contentHeaderTitle = document.querySelector('.main-content .content-header h2');
    const incomingSection = document.getElementById('incoming-section');
    const receivedSection = document.getElementById('received-section');
    const outgoingSection = document.getElementById('outgoing-section');
    const holdSection = document.getElementById('hold-section');
    const completeSection = document.getElementById('complete-section');
    const logsSection = document.getElementById('logs-section');
    const trackSection = document.getElementById('track-section');

    // Map sidebar navigation links to their corresponding content sections
    const sectionsMap = [
        { link: document.querySelector('.nav-link[data-section="incoming"]'), section: incomingSection },  // Incoming
        { link: document.querySelector('.nav-link[data-section="received"]'), section: receivedSection },  // Received
        { link: document.querySelector('.nav-link[data-section="outgoing"]'), section: outgoingSection },  // Outgoing
        { link: document.querySelector('.nav-link[data-section="hold"]'), section: holdSection },      // Hold
        { link: document.querySelector('.nav-link[data-section="complete"]'), section: completeSection },  // Complete
        { link: document.querySelector('.nav-link[data-section="logs"]'), section: logsSection },      // Logs
        { link: document.querySelector('.nav-link[data-section="track"]'), section: trackSection }       // Track
    ];

    function showSection(sectionToShow, sidebarLinkToActivate, headerTitle) {
        // Hide all managed main content sections
        sectionsMap.forEach(item => {
            if (item.section) {
                item.section.style.display = 'none';
            }
        });

        // Show the requested section
        if (sectionToShow) {
            sectionToShow.style.display = 'block';
        }

        // Update sidebar active class
        const currentlyActive = document.querySelector('.nav-link.active');
        if (currentlyActive) {
            currentlyActive.classList.remove('active');
        }
        if (sidebarLinkToActivate) {
            sidebarLinkToActivate.classList.add('active');
        }

        // Update main content header title (if present)
        if (contentHeaderTitle && headerTitle) {
            contentHeaderTitle.textContent = headerTitle;
        }
    }

    // Initial setup: ensure Incoming section is visible and active on load
    showSection(incomingSection, sectionsMap[0].link, 'Incoming Documents'); // Incoming is the first one

    // Add event listeners for all sidebar links
    sectionsMap.forEach((item, index) => {
        if (item.link) {
            item.link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                let headerTitle = '';
                switch(index) {
                    case 0: // Incoming
                        headerTitle = 'Incoming Documents';
                        break;
                    case 1: // Received
                        headerTitle = 'Received Documents';
                        break;
                    case 2: // Outgoing
                        headerTitle = 'Outgoing Documents';
                        break;
                    case 3: // Hold
                        headerTitle = 'Hold Documents';
                        break;
                    case 4: // Complete
                        headerTitle = 'Complete Documents';
                        break;
                    case 5: // Logs
                        headerTitle = 'Activity Logs';
                        break;
                    case 6: // Track
                        headerTitle = 'Track Documents';
                        break;
                }
                showSection(item.section, item.link, headerTitle);
            });
        }
    });

    // Handle incoming action dropdown
    const incomingActionButtons = document.querySelectorAll('.incoming-action-btn');
    incomingActionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = button.nextElementSibling;
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.incoming-action-btn')) {
            const dropdowns = document.querySelectorAll('.action-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    // Handle dropdown actions
    const acceptActions = document.querySelectorAll('.accept-action');
    acceptActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Document accepted! (Demo)');
            const dropdown = action.closest('.action-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    });

    const detailsActions = document.querySelectorAll('.details-action');
    detailsActions.forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Showing document details... (Demo)');
            const dropdown = action.closest('.action-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        });
    });

    // Search functionality for all sections
    const searchInputs = document.querySelectorAll('#search-input, #incoming-search-input, #received-search-input, #outgoing-search-input, #hold-search-input, #complete-search-input, #logs-search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cardsContainer = this.closest('.content-section').querySelector('.cards-container');
            
            if (cardsContainer) {
                const cards = cardsContainer.querySelectorAll('.document-card, .log-card');
                
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // Show entries functionality
    const showEntriesSelects = document.querySelectorAll('#show-entries, #incoming-show-entries, #received-show-entries, #outgoing-show-entries, #hold-show-entries, #complete-show-entries, #logs-show-entries');
    
    showEntriesSelects.forEach(select => {
        select.addEventListener('change', function() {
            const entriesToShow = parseInt(this.value);
            const cardsContainer = this.closest('.content-section').querySelector('.cards-container');
            
            if (cardsContainer) {
                const cards = cardsContainer.querySelectorAll('.document-card, .log-card');
                
                cards.forEach((card, index) => {
                    if (index < entriesToShow) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // Track functionality
    const trackSearchBtn = document.getElementById('track-search-btn');
    const trackDocCode = document.getElementById('track-doc-code');
    const trackDate = document.getElementById('track-date');
    const trackMonth = document.getElementById('track-month');
    const trackTime = document.getElementById('track-time');
    const trackResults = document.getElementById('track-results');

    if (trackSearchBtn) {
        trackSearchBtn.addEventListener('click', async () => {
            trackResults.innerHTML = '<div class="track-loading">Searching...</div>';
            const code = trackDocCode.value.trim();
            const date = trackDate.value;
            const month = trackMonth.value;
            const time = trackTime.value;
            const docs = await fetchTrackedDocument({ code, date, month, time });
            if (Array.isArray(docs) && docs.length > 0) {
                trackResults.innerHTML = docs.map(renderTrackResult).join('');
            } else if (docs && docs._id) {
                trackResults.innerHTML = renderTrackResult(docs);
            } else {
                trackResults.innerHTML = '<div class="track-no-result">No document found.</div>';
            }
        });
    }

    async function fetchTrackedDocument({ code, date, month, time }) {
        let url = 'https://trackit-backend-xu6a.onrender.com/api/documents/search?';
        const params = [];
        if (code) params.push(`document_code=${encodeURIComponent(code)}`);
        if (date) params.push(`date=${encodeURIComponent(date)}`);
        if (month) params.push(`month=${encodeURIComponent(month)}`);
        if (time) params.push(`time=${encodeURIComponent(time)}`);
        url += params.join('&');
        const res = await fetch(url);
        return await res.json();
    }

    function renderTimeline(statusHistory) {
        if (!statusHistory || !statusHistory.length) return '<div class="timeline-empty">No status history available.</div>';
        return `<div class="timeline">
            ${statusHistory.map(item => `
                <div class="timeline-item">
                    <div class="timeline-status">${item.status}</div>
                    <div class="timeline-meta">${item.office_name || ''} ${item.user_name ? 'by ' + item.user_name : ''}</div>
                    <div class="timeline-date">${new Date(item.date).toLocaleString()}</div>
                </div>
            `).join('')}
        </div>`;
    }

    function renderTrackResult(doc) {
        if (!doc) return '<div class="track-no-result">No document found.</div>';
        return `
        <div class="track-doc-card">
            <div class="track-doc-main">
                <div><b>Code:</b> ${doc.document_code}</div>
                <div><b>Title:</b> ${doc.title}</div>
                <div><b>Type:</b> ${doc.type_id?.type_name || '-'}</div>
                <div><b>Current Office:</b> ${doc.current_office_id?.office_name || '-'}</div>
                <div><b>Status:</b> ${doc.status}</div>
                </div>
            <div class="track-doc-timeline">
                <h4>Status Timeline</h4>
                ${renderTimeline(doc.status_history)}
                </div>
            </div>
        `;
    }

    // Form submission for new documents
    const newDocumentForm = document.getElementById('newDocumentForm');
    if (newDocumentForm) {
        newDocumentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const requisitioner = document.getElementById('requisitioner').value;
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const type = document.getElementById('type').value;
            const remarks = document.getElementById('remarks').value;

            // Get logged-in user
            const user = window.loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'));
            let requester_office_id = user.office_id;
            if (requester_office_id && typeof requester_office_id === 'object' && requester_office_id._id) {
                requester_office_id = requester_office_id._id;
            }
            // Find the type_id for the selected type name
            const docType = documentTypes.find(dt => dt.type_name === type);
            if (!docType) {
                alert('Invalid document type selected.');
                return;
            }
            const type_id = docType._id;
            // Debug log
            console.log({
                title,
                content,
                type_id,
                requester_office_id,
                status: 'RELEASED'
            });
            // Send to backend
            const response = await fetch('https://trackit-backend-xu6a.onrender.com/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    type_id,
                    requester_office_id,
                    status: 'RELEASED'
                })
            });
            const result = await response.json();
            if (response.ok) {
                // Optionally, update your UI with the new document
                renderOutgoingCards();
            newDocumentModal.style.display = 'none';
                newDocumentForm.reset();
                if (window.updateSidebarBadges) window.updateSidebarBadges();
                if (window.updateSummaryCards) window.updateSummaryCards();
            } else {
                alert(result.error || 'Failed to create document');
            }
        });
    }

    // Sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.top-bar i.fa-bars');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.sidebar') && !e.target.closest('.top-bar')) {
                sidebar.classList.remove('show');
            }
        }
    });

    // === DYNAMIC LOG CARD RENDERING ===
    // Dummy data array
    const documents = [
        {
            code: 'VPAA-2025-06-0001',
            requisitioner: 'VPAA',
            title: 'REQUEST OF SPECIAL CLASS FORM',
            type: 'SPECIAL CLASS FORM',
            status: 'RECEIVED',
            date: 'JUNE , 2024 08:25 PM'
        },
        {
            code: 'CSIT-2025-06-0002',
            requisitioner: 'CSIT OFFICE',
            title: 'REQUEST TO JOIN IN SPECIAL CLASS',
            type: 'FORM',
            status: 'RELEASED',
            date: 'JUNE 27, 2025 04:30 PM'
        },
        {
            code: 'VPAA-2025-06-0002',
            requisitioner: 'ADMINISTRATION DEPARTMENT',
            title: 'PURCHASE REQUEST FOR PRINTER',
            type: 'PURCHASE REQUEST',
            status: 'RECEIVED',
            date: 'FEBRUARY 10, 2024 08:23 PM'
        }
    ];

    // Status badge color helper
    function getStatusClass(status) {
        switch (status) {
            case 'RECEIVED': return 'status-badge received';
            case 'RELEASED': return 'status-badge released';
            case 'HOLD': return 'status-badge hold';
            default: return 'status-badge';
        }
    }

    function renderLogCards() {
        const container = document.getElementById('log-container');
        if (!container) return;
        container.innerHTML = '';
        documents.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <span class="${getStatusClass(doc.status)}">${doc.status}</span>
                    <span class="log-date">${doc.date}</span>
                </div>
                <div class="log-content">
                    <div class="log-row"><span class="label">Code:</span> <span class="value">${doc.code}</span></div>
                    <div class="log-row"><span class="label">Requisitioner:</span> <span class="value">${doc.requisitioner}</span></div>
                    <div class="log-row"><span class="label">Title:</span> <span class="value">${doc.title}</span></div>
                    <div class="log-row"><span class="label">Type:</span> <span class="value">${doc.type}</span></div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Initial render
    renderLogCards();

    // Example: Add a new document and re-render
    // documents.push({
    //   code: 'NEW-2025-07-0001',
    //   requisitioner: 'NEW OFFICE',
    //   title: 'NEW DOCUMENT TITLE',
    //   type: 'NEW TYPE',
    //   status: 'RECEIVED',
    //   date: 'JULY 1, 2025 10:00 AM'
    // });
    // renderLogCards();

    // --- DYNAMIC INCOMING CARD ACTIONS ---
    (function() {
        // Dummy data for incoming documents
        window.incomingDocs = window.incomingDocs || [
            {
                code: 'CLASE-2025-06-0001',
                office: "CLASE Dean's Office",
                subject: 'REQUEST FOR APPROVAL',
                content: 'Approval for this student to enroll in BSIT Program: John Russel Soria',
                type: 'COMMUNICATION LETTER',
                fromOffice: "CLASE Dean's Office",
                releasedBy: 'DELA CRUZ',
                releasedDate: 'FEB. 08, 2024 11:00 PM',
                forwardedTo: null
            }
        ];
        const officeOptions = [
            'VPAA',
            "CLASE Dean's Office",
            'Registrar',
            'Accounting',
            'HRMO',
            'CSIT Office'
        ];
        const currentOffice = 'CSIT Office';

        // Render incoming cards
        function renderIncomingCards() {
            const container = document.getElementById('incoming-container');
            if (!container) return;
            container.innerHTML = '';
            incomingDocs.forEach((doc, idx) => {
                const card = document.createElement('div');
                card.className = 'document-card incoming-card';
                card.setAttribute('data-index', idx);
                card.innerHTML = `
                    <div class="card-header">
                        <div class="document-code">${doc.code}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-row"><div class="label">Office:</div><div class="value">${doc.office}</div></div>
                        <div class="card-row"><div class="label">Subject:</div><div class="value">${doc.subject}</div></div>
                        <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content}</div></div>
                        <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type}</div></div>
                        <div class="card-row"><div class="label">From Office:</div><div class="value">${doc.fromOffice}</div></div>
                        <div class="card-row"><div class="label">Released By:</div><div class="value">${doc.releasedBy}</div></div>
                        <div class="card-row"><div class="label">Released Date:</div><div class="value">${doc.releasedDate}</div></div>
                        ${doc.forwardedTo ? `<div class='card-row'><span class='label'>Forwarded to:</span> <span class='value forwarded-label'>${doc.forwardedTo}</span></div>` : ''}
                    </div>
                `;
                card.style.cursor = 'pointer';
                card.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openActionModal(idx);
                });
                container.appendChild(card);
            });
        }

        // Modal creation (if not present)
        let actionModal = document.getElementById('incoming-action-modal');
        if (!actionModal) {
            actionModal = document.createElement('div');
            actionModal.id = 'incoming-action-modal';
            actionModal.className = 'modal';
            actionModal.style.display = 'none';
            document.body.appendChild(actionModal);
        }
        let selectedIndex = null;

        // Modal open logic
        function openActionModal(idx) {
            selectedIndex = idx;
            const doc = incomingDocs[idx];
            actionModal.innerHTML = `
                <div class="modal-content" style="max-width:420px;width:96%;border-radius:16px;box-shadow:0 8px 32px rgba(44,62,80,0.18),0 1.5px 6px rgba(44,62,80,0.10);padding:32px 32px 24px 32px;">
                    <h2 style="margin-top:0;margin-bottom:20px;font-size:1.2em;font-weight:700;color:#222;">Choose Action</h2>
                    <div style="margin-bottom: 22px;line-height:1.7;">
                        <div style='margin-bottom:6px;'><span style='font-weight:600;color:#222;'>Code:</span> <span style='color:#222;'>${doc.code}</span></div>
                        <div style='margin-bottom:6px;'><span style='font-weight:600;color:#222;'>Office:</span> <span style='color:#222;'>${doc.office}</span></div>
                        <div style='margin-bottom:6px;'><span style='font-weight:600;color:#222;'>Subject:</span> <span style='color:#222;'>${doc.subject}</span></div>
                        <div style='margin-bottom:6px;'><span style='font-weight:600;color:#222;'>Type:</span> <span style='color:#222;'>${doc.type}</span></div>
                        <div style='margin-bottom:6px;'><span style='font-weight:600;color:#222;'>Content:</span> <span style='color:#222;'>${doc.content}</span></div>
                    </div>
                    <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 24px;">
                        <button id="modal-receive-btn" class="btn-logout" style="background: #27ae60;">Receive</button>
                        <button id="modal-hold-btn" class="btn-cancel" style="background: #f59e42;">On Hold</button>
                        <button id="modal-cancel-btn" class="btn-cancel">Cancel</button>
                    </div>
                    <div style="margin-top:10px;padding:18px 0 0 0;border-top:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;justify-content:center;">
                        <label for="forward-office-select" style="font-weight:600;color:#222;margin-right:4px;">Forward to Office:</label>
                        <select id="forward-office-select" style="padding:7px 12px;border-radius:6px;border:1px solid #ddd;">${officeOptions.filter(o => o !== currentOffice).map(o => `<option value='${o}'>${o}</option>`).join('')}</select>
                        <button id="forward-doc-btn" class="btn-logout" style="background:#27ae60;color:white;padding:7px 18px;border-radius:6px;">Forward</button>
                    </div>
                </div>
            `;
            actionModal.style.display = 'flex';
            actionModal.querySelector('#modal-receive-btn').onclick = function () {
                if (selectedIndex !== null) {
                    document.getElementById('received-container').appendChild(document.querySelector(`#incoming-container .document-card[data-index='${selectedIndex}']`));
                    selectedIndex = null;
                    actionModal.style.display = 'none';
                    if (window.updateSidebarBadges) window.updateSidebarBadges();
                    if (window.updateSummaryCards) window.updateSummaryCards();
                }
            };
            actionModal.querySelector('#modal-hold-btn').onclick = function () {
                if (selectedIndex !== null) {
                    document.getElementById('onhold-container').appendChild(document.querySelector(`#incoming-container .document-card[data-index='${selectedIndex}']`));
                    selectedIndex = null;
                    actionModal.style.display = 'none';
                    if (window.updateSidebarBadges) window.updateSidebarBadges();
                    if (window.updateSummaryCards) window.updateSummaryCards();
                }
            };
            actionModal.querySelector('#modal-cancel-btn').onclick = function () {
                selectedIndex = null;
                actionModal.style.display = 'none';
            };
            actionModal.querySelector('#forward-doc-btn').onclick = function () {
                if (selectedIndex !== null) {
                    const toOffice = actionModal.querySelector('#forward-office-select').value;
                    forwardIncomingDoc(selectedIndex, toOffice);
                    actionModal.style.display = 'none';
                }
            };
            actionModal.onclick = function (e) {
                if (e.target === actionModal) {
                    actionModal.style.display = 'none';
                    selectedIndex = null;
                }
            };
        }

        // Forward logic for incoming
        function forwardIncomingDoc(idx, toOffice) {
            const doc = incomingDocs[idx];
            if (!doc) return;
            doc.forwardedTo = toOffice;
            // Remove from incoming
            incomingDocs.splice(idx, 1);
            // Move to forwarded section
            const forwardedContainer = document.getElementById('forwarded-container');
            if (forwardedContainer) {
                const card = document.createElement('div');
                card.className = 'document-card forwarded-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="document-code">${doc.code}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-row"><div class="label">Office:</div><div class="value">${doc.office}</div></div>
                        <div class="card-row"><div class="label">Subject:</div><div class="value">${doc.subject}</div></div>
                        <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content}</div></div>
                        <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type}</div></div>
                        <div class='card-row'><span class='label'>Forwarded to:</span> <span class='value forwarded-label'>${toOffice}</span></div>
                </div>
                `;
                forwardedContainer.appendChild(card);
            }
            renderIncomingCards();
            if (window.updateSidebarBadges) window.updateSidebarBadges();
            if (window.updateSummaryCards) window.updateSummaryCards();
        }

        // Expose for testing
        window.renderIncomingCards = renderIncomingCards;
        window.openActionModal = openActionModal;
        window.forwardIncomingDoc = forwardIncomingDoc;

        // Initial render
        renderIncomingCards();
    })();

    // --- BADGE COUNT UPDATER ---
    (function() {
        // Map section keys to their doc arrays and badge selectors
        const sectionConfig = [
            { key: 'incoming',    arrayName: 'incomingDocs',  badgeSelector: '.nav-link[data-section="incoming"] .badge',  containerId: 'incoming-container' },
            { key: 'received',    arrayName: 'receivedDocs',  badgeSelector: '.nav-link[data-section="received"] .badge',  containerId: 'received-container' },
            { key: 'outgoing',    arrayName: 'outgoingDocs',  badgeSelector: '.nav-link[data-section="outgoing"] .badge',  containerId: 'outgoing-container' },
            { key: 'hold',        arrayName: 'holdDocs',      badgeSelector: '.nav-link[data-section="hold"] .badge',      containerId: 'onhold-container' },
            { key: 'complete',    arrayName: 'completeDocs',  badgeSelector: '.nav-link[data-section="complete"] .badge',  containerId: 'complete-container' },
            { key: 'logs',        arrayName: 'logDocs',       badgeSelector: '.nav-link[data-section="logs"] .badge',      containerId: 'log-container' },
        ];

        // Dummy arrays for demonstration (replace with your actual arrays)
        window.incomingDocs = window.incomingDocs || [];
        window.receivedDocs = window.receivedDocs || [];
        window.outgoingDocs = window.outgoingDocs || [];
        window.holdDocs = window.holdDocs || [];
        window.completeDocs = window.completeDocs || [];
        window.logDocs = window.logDocs || [];

        // Count cards in a section by container
        function countCardsInContainer(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return 0;
            return container.querySelectorAll('.document-card, .log-card').length;
        }

        // Update all sidebar badges
        function updateSidebarBadges() {
            sectionConfig.forEach(cfg => {
                const badge = document.querySelector(cfg.badgeSelector);
                if (badge) {
                    badge.textContent = countCardsInContainer(cfg.containerId);
                }
            });
        }

        // Expose for use after any document move
        window.updateSidebarBadges = updateSidebarBadges;

        // Initial update
        updateSidebarBadges();

        // Example: Call updateSidebarBadges() after moving cards between sections
        // window.updateSidebarBadges();
    })();

    // --- SUMMARY CARDS UPDATER ---
    (function() {
        function getCount(arr) {
            return Array.isArray(arr) ? arr.length : 0;
        }
        function updateSummaryCards() {
            // Use global arrays or fallback to 0
            const incoming = window.incomingDocs || [];
            const received = window.receivedDocs || [];
            const outgoing = window.outgoingDocs || [];
            const total = getCount(incoming) + getCount(received) + getCount(outgoing);

            const totalEl = document.getElementById('total-docs-count');
            const incomingEl = document.getElementById('incoming-docs-count');
            const receivedEl = document.getElementById('received-docs-count');
            const outgoingEl = document.getElementById('outgoing-docs-count');

            if (totalEl) totalEl.textContent = total;
            if (incomingEl) incomingEl.textContent = getCount(incoming);
            if (receivedEl) receivedEl.textContent = getCount(received);
            if (outgoingEl) outgoingEl.textContent = getCount(outgoing);
        }
        window.updateSummaryCards = updateSummaryCards;
        updateSummaryCards();
    })();

    // After any document move or addition, call window.updateSummaryCards();

    // In modal handlers, after moving a card, also call window.updateSummaryCards();

    // --- RECEIVED SECTION MODULAR LOGIC ---
    (function() {
        // Dummy data for received documents
        window.receivedDocs = window.receivedDocs || [
            {
                code: 'VPAA-2025-06-0001',
                requisitioner: 'VPAA',
                title: 'REQUEST OF SPECIAL CLASS FORM',
                content: 'Request for special class',
                type: 'SPECIAL CLASS FORM',
                forwardedTo: null
            }
        ];
        const officeOptions = [
            'VPAA',
            "CLASE Dean's Office",
            'Registrar',
            'Accounting',
            'HRMO',
            'CSIT Office'
        ];
        const currentOffice = 'CSIT Office';

        // Render received cards
        function renderReceivedCards() {
            const container = document.getElementById('received-container');
            if (!container) return;
            container.innerHTML = '';
            receivedDocs.forEach((doc, idx) => {
                const card = document.createElement('div');
                card.className = 'document-card received-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="document-code">${doc.code}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-row"><div class="label">Requisitioner:</div><div class="value">${doc.requisitioner}</div></div>
                        <div class="card-row"><div class="label">Title:</div><div class="value">${doc.title}</div></div>
                        <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content || ''}</div></div>
                        <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type}</div></div>
                        ${doc.forwardedTo ? `<div class='card-row'><span class='label'>Forwarded to:</span> <span class='value forwarded-label'>${doc.forwardedTo}</span></div>` : ''}
                </div>
                `;
                card.style.cursor = 'pointer';
                card.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openReceivedModal(idx);
                });
                container.appendChild(card);
            });
        }

        // Modal creation (if not present)
        let receivedModal = document.getElementById('received-action-modal');
        if (!receivedModal) {
            receivedModal = document.createElement('div');
            receivedModal.id = 'received-action-modal';
            receivedModal.className = 'modal';
            receivedModal.style.display = 'none';
            document.body.appendChild(receivedModal);
        }

        // Open modal for received card
        function openReceivedModal(index) {
            const doc = receivedDocs[index];
            if (!doc) return;
            receivedModal.innerHTML = `
                <div class="modal-content" style="max-width:420px;width:96%;border-radius:16px;box-shadow:0 8px 32px rgba(44,62,80,0.18),0 1.5px 6px rgba(44,62,80,0.10);padding:32px 32px 24px 32px;">
                    <h2 style="margin-top:0;margin-bottom:20px;font-size:1.2em;font-weight:700;color:#222;">Document Actions</h2>
                    <div style="margin-bottom: 16px;line-height:1.7;">
                        <strong>Code:</strong> ${doc.code}<br>
                        <strong>Requisitioner:</strong> ${doc.requisitioner}<br>
                        <strong>Title:</strong> ${doc.title}<br>
                        <strong>Type:</strong> ${doc.type}<br>
                        <strong>Content:</strong> ${doc.content || ''}<br>
                        ${doc.forwardedTo ? `<strong>Forwarded to:</strong> ${doc.forwardedTo}<br>` : ''}
                    </div>
                    <div style="display:flex;gap:10px;margin-bottom:18px;">
                        <button id="view-details-btn" class="btn-cancel" style="background:#f1f5f9;color:#222;">View Details</button>
                        <button id="delete-doc-btn" class="btn-cancel" style="background:#e74c3c;color:white;">Delete</button>
                    </div>
                    <div style="margin-top:10px;margin-bottom:18px;">
                        <label for="forward-office-select"><strong>Forward to Office:</strong></label>
                        <select id="forward-office-select" style="margin-left:8px;padding:7px 12px;border-radius:6px;border:1px solid #ddd;">${officeOptions.filter(o => o !== currentOffice).map(o => `<option value='${o}'>${o}</option>`).join('')}</select>
                        <button id="forward-doc-btn" class="btn-logout" style="background:#27ae60;color:white;margin-left:10px;padding:7px 18px;border-radius:6px;">Forward</button>
                    </div>
                    <button id="close-received-modal" class="btn-cancel" style="margin-top:10px;background:#f1f5f9;color:#222;">Close</button>
                </div>
            `;
            receivedModal.style.display = 'flex';
            receivedModal.querySelector('#close-received-modal').onclick = () => receivedModal.style.display = 'none';
            receivedModal.querySelector('#delete-doc-btn').onclick = function() {
                receivedDocs.splice(index, 1);
                renderReceivedCards();
                receivedModal.style.display = 'none';
            };
            receivedModal.querySelector('#view-details-btn').onclick = function() {
                alert(`Details:\nCode: ${doc.code}\nRequisitioner: ${doc.requisitioner}\nTitle: ${doc.title}\nType: ${doc.type}\nContent: ${doc.content || ''}`);
            };
            receivedModal.querySelector('#forward-doc-btn').onclick = function() {
                const toOffice = receivedModal.querySelector('#forward-office-select').value;
                forwardReceivedDoc(index, toOffice);
                receivedModal.style.display = 'none';
            };
            receivedModal.onclick = function(e) {
                if (e.target === receivedModal) receivedModal.style.display = 'none';
            };
        }

        // Forward logic for received
        function forwardReceivedDoc(index, toOffice) {
            const doc = receivedDocs[index];
            if (!doc) return;
            // Mark as forwarded
            doc.forwardedTo = toOffice;
            // Remove from received
            receivedDocs.splice(index, 1);
            // Move to forwarded section
            const forwardedContainer = document.getElementById('forwarded-container');
            if (forwardedContainer) {
                const card = document.createElement('div');
                card.className = 'document-card forwarded-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="document-code">${doc.code}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-row"><div class="label">Requisitioner:</div><div class="value">${doc.requisitioner}</div></div>
                        <div class="card-row"><div class="label">Title:</div><div class="value">${doc.title}</div></div>
                        <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content || ''}</div></div>
                        <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type}</div></div>
                        <div class='card-row'><span class='label'>Forwarded to:</span> <span class='value forwarded-label'>${toOffice}</span></div>
                </div>
                `;
                forwardedContainer.appendChild(card);
            }
            renderReceivedCards();
            if (window.updateSidebarBadges) window.updateSidebarBadges();
            if (window.updateSummaryCards) window.updateSummaryCards();
        }

        // Expose for testing
        window.renderReceivedCards = renderReceivedCards;
        window.openReceivedModal = openReceivedModal;
        window.forwardReceivedDoc = forwardReceivedDoc;

        // Initial render
        renderReceivedCards();
    })();

    // --- OUTGOING NEW DOCUMENT MODAL LOGIC ---
    (function() {
        const typeCodeMap = {
            "Memo": "MEMO",
            "Communication Letter": "COMM",
            "Purchase Request": "PR"
            // Add more as needed
        };
        const outgoingNewDocBtn = document.getElementById('outgoing-new-doc-btn');
        const outgoingNewDocModal = document.getElementById('outgoingNewDocModal');
        const outgoingNewDocForm = document.getElementById('outgoingNewDocForm');
        const outgoingNewDocCancel = document.getElementById('outgoingNewDocCancel');
        const outgoingContainer = document.getElementById('outgoing-container');

        // Store outgoing docs in memory
        window.outgoingDocs = window.outgoingDocs || [];

        // Helper to generate code ([TYPE]-CSIT-YYYY-MM-XXXX)
        function generateDocCode(type) {
            const typePrefix = typeCodeMap[type] || "DOC";
            const officePrefix = "CSIT"; // Or dynamically get current office
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const count = window.outgoingDocs.length + 1;
            const serial = String(count).padStart(4, '0');
            return `${typePrefix}-${officePrefix}-${year}-${month}-${serial}`;
        }

        // Render outgoing cards
        function renderOutgoingCards() {
            if (!outgoingContainer) return;
            outgoingContainer.innerHTML = '';
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            const officeId = user?.office_id?._id || user?.office_id;
            const outgoingDocsForOffice = Array.isArray(window.outgoingDocs) && officeId
                ? window.outgoingDocs.filter(doc => String(doc.requester_office_id?._id || doc.requester_office_id) === String(officeId))
                : [];
            outgoingDocsForOffice.forEach(doc => {
                const card = document.createElement('div');
                card.className = 'document-card outgoing-card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="document-code">${doc.document_code || '-'}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type_id?.type_name || '-'}</div></div>
                        <div class="card-row"><div class="label">Title:</div><div class="value">${doc.title || '-'}</div></div>
                        <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content || '-'}</div></div>
                        <div class="card-row"><div class="label">Destination Office:</div><div class="value">${doc.current_office_id?.office_name || '-'}</div></div>
                        <div class="card-row"><div class="label">Status:</div><div class="value"><span class="status-badge released">${doc.status || '-'}</span></div></div>
                        <div class="card-row"><div class="label">Released Date:</div><div class="value">${doc.created_at ? new Date(doc.created_at).toLocaleString() : '-'}</div></div>
                    </div>
                `;
                outgoingContainer.appendChild(card);
            });
        }

        // Show modal
        if (outgoingNewDocBtn && outgoingNewDocModal) {
            outgoingNewDocBtn.onclick = function() {
                outgoingNewDocModal.style.display = 'flex';
            };
        }
        // Hide modal
        if (outgoingNewDocCancel && outgoingNewDocModal) {
            outgoingNewDocCancel.onclick = function() {
                outgoingNewDocModal.style.display = 'none';
                outgoingNewDocForm.reset();
            };
        }
        // Hide modal on outside click
        if (outgoingNewDocModal) {
            outgoingNewDocModal.onclick = function(e) {
                if (e.target === outgoingNewDocModal) {
                    outgoingNewDocModal.style.display = 'none';
                    outgoingNewDocForm.reset();
                }
            };
        }
        // Handle form submit
        if (outgoingNewDocForm) {
            outgoingNewDocForm.onsubmit = async function(e) {
                e.preventDefault();
                const title = document.getElementById('outgoingDocTitle').value.trim();
                const typeName = document.getElementById('outgoingDocType').value;
                const content = document.getElementById('outgoingDocContent').value.trim();
                const office = document.getElementById('outgoingDocOffice').value;
                if (!title || !typeName || !office) return;

                // Get logged-in user
                const user = window.loggedInUser || JSON.parse(localStorage.getItem('loggedInUser'));
                let requester_office_id = user.office_id;
                if (requester_office_id && typeof requester_office_id === 'object' && requester_office_id._id) {
                    requester_office_id = requester_office_id._id;
                }
                // Find the type_id for the selected type name
                const docType = documentTypes.find(dt => dt.type_name === typeName);
                if (!docType) {
                    alert('Invalid document type selected.');
                    return;
                }
                const type_id = docType._id;
                // Debug log
                console.log({
                    title,
                    content,
                    type_id,
                    requester_office_id,
                    status: 'RELEASED'
                });
                // Send to backend
                const response = await fetch('https://trackit-backend-xu6a.onrender.com/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title,
                        content,
                        type_id,
                        requester_office_id,
                        status: 'RELEASED',
                        current_office_id: office
                    })
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Document successfully added!');
                    await fetchAndRenderOutgoingDocs();
                outgoingNewDocModal.style.display = 'none';
                outgoingNewDocForm.reset();
                if (window.updateSidebarBadges) window.updateSidebarBadges();
                if (window.updateSummaryCards) window.updateSummaryCards();
                } else {
                    alert(result.error || 'Failed to create document');
                }
            };
        }
        // Initial render
        renderOutgoingCards();
        window.renderOutgoingCards = renderOutgoingCards;
    })();

    // --- DASHBOARD OVERVIEW CARDS CLICKABLE NAVIGATION ---
    const overviewCardMap = [
        { cardId: 'track-documents-card', sectionId: 'track-section' },
        { cardId: 'incoming-documents-card', sectionId: 'incoming-section' },
        { cardId: 'received-documents-card', sectionId: 'received-section' },
        { cardId: 'outgoing-documents-card', sectionId: 'outgoing-section' }
    ];
    overviewCardMap.forEach(({ cardId, sectionId }) => {
        const card = document.getElementById(cardId);
        const section = document.getElementById(sectionId);
        if (card && section) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                // Hide all content sections
                document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
                // Show the selected section
                section.style.display = 'block';
            });
        }
    });

    // --- DYNAMIC DASHBOARD CARD COUNTS ---
    function updateDashboardCounts() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const officeId = user?.office_id?._id || user?.office_id;
        const incomingCount = Array.isArray(window.incomingDocs) ? window.incomingDocs.length : 0;
        const receivedCount = Array.isArray(window.receivedDocs) ? window.receivedDocs.length : 0;
        let outgoingCount = 0;
        if (Array.isArray(window.outgoingDocs) && officeId) {
            outgoingCount = window.outgoingDocs.filter(
                doc => String(doc.requester_office_id?._id || doc.requester_office_id) === String(officeId)
            ).length;
        }
        const incomingEl = document.getElementById('incoming-docs-count');
        const receivedEl = document.getElementById('received-docs-count');
        const outgoingEl = document.getElementById('outgoing-docs-count');
        if (incomingEl) incomingEl.textContent = incomingCount;
        if (receivedEl) receivedEl.textContent = receivedCount;
        if (outgoingEl) outgoingEl.textContent = outgoingCount;
        // Update sidebar badge for outgoing
        const outgoingBadge = document.querySelector('.nav-link[data-section="outgoing"] .badge');
        if (outgoingBadge) outgoingBadge.textContent = outgoingCount;
    }
    window.updateDashboardCounts = updateDashboardCounts;
    updateDashboardCounts();

    // Call updateDashboardCounts() after any document array change
    // Example: after moving, adding, or removing documents
    // ... existing code ...

    // Example: After rendering cards or changing arrays, call:
    // updateDashboardCounts();

    // Set sidebar/profile office name dynamically after login or show 'Guest'
    const userNameElem = document.querySelector('.user-name');
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('loggedInUser'));
    } catch (e) {
        user = null;
    }
    if (userNameElem) {
        if (user && user.office_id && user.office_id.office_name) {
            userNameElem.textContent = user.office_id.office_name;
        } else {
            userNameElem.textContent = 'Guest';
        }
    }

    let documentTypes = [];

    async function loadDocumentTypes() {
        const res = await fetch('https://trackit-backend-xu6a.onrender.com/api/document-types');
        documentTypes = await res.json();
    }
    window.loadDocumentTypes = loadDocumentTypes;

    loadDocumentTypes();

    async function fetchAndRenderOutgoingDocs() {
        // Always fetch all outgoing documents from the populated endpoint
        const res = await fetch('https://trackit-backend-xu6a.onrender.com/api/documents?type=outgoing');
        const docs = await res.json();
        window.outgoingDocs = docs;
        renderOutgoingCards();
    }

    await fetchAndRenderOutgoingDocs();

    // --- INCOMING DOCUMENTS WORKFLOW ---
    async function fetchAndRenderIncomingDocs() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const myOfficeId = user.office_id?._id || user.office_id;
        const res = await fetch(`https://trackit-backend-xu6a.onrender.com/api/documents/incoming?office_id=${myOfficeId}`);
        const incomingDocs = await res.json();
        window.incomingDocs = incomingDocs;
        renderIncomingCards(incomingDocs);
        updateIncomingBadge(incomingDocs.length);
    }

    function renderIncomingCards(docs) {
        const incomingContainer = document.getElementById('incoming-container');
        if (!incomingContainer) return;
        incomingContainer.innerHTML = '';
        docs.forEach(doc => {
            const latestStatus = doc.status_history?.[doc.status_history.length - 1];
            const fromOffice = latestStatus?.from_office_id?.office_name || '-';
            const card = document.createElement('div');
            card.className = 'document-card incoming-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="document-code">${doc.document_code || '-'}</div>
                </div>
                <div class="card-content">
                    <div class="card-row"><div class="label">From Office:</div><div class="value">${fromOffice}</div></div>
                    <div class="card-row"><div class="label">Title:</div><div class="value">${doc.title || '-'}</div></div>
                    <div class="card-row"><div class="label">Content:</div><div class="value">${doc.content || '-'}</div></div>
                    <div class="card-row"><div class="label">Type:</div><div class="value">${doc.type_id?.type_name || '-'}</div></div>
                    <div class="card-row"><div class="label">Status:</div><div class="value">${doc.status || '-'}</div></div>
                    <div class="action-btn-group">
                      <button class="action-btn receive-btn" onclick="receiveDocument('${doc._id}')">Receive</button>
                      <button class="action-btn hold-btn" onclick="holdDocument('${doc._id}')">Hold</button>
                      <button class="action-btn decline-btn" onclick="declineDocument('${doc._id}')">Decline</button>
                    </div>
                </div>
            `;
            incomingContainer.appendChild(card);
        });
    }

    function updateIncomingBadge(count) {
        const incomingBadge = document.querySelector('.nav-link[data-section="incoming"] .badge');
        if (incomingBadge) incomingBadge.textContent = count;
    }

    async function receiveDocument(docId) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const myOfficeId = user.office_id?._id || user.office_id;
        const myUserId = user._id;
        if (!confirm('Are you sure you want to mark this document as RECEIVED?')) return;
        try {
            const res = await fetch(`https://trackit-backend-xu6a.onrender.com/api/documents/${docId}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'receive',
                    office_id: myOfficeId,
                    user_id: myUserId,
                    remarks: 'Document received'
                })
            });
            if (!res.ok) throw new Error('Failed to receive document');
            alert('Document marked as RECEIVED.');
            await fetchAndRenderIncomingDocs();
            await fetchAndRenderReceivedDocs();
            // Switch to Received section
            const receivedSection = document.getElementById('received-section');
            const receivedLink = document.querySelector('.nav-link[data-section="received"]');
            if (receivedSection && receivedLink) {
                showSection(receivedSection, receivedLink, 'Received Documents');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function holdDocument(docId) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const myOfficeId = user.office_id?._id || user.office_id;
        const myUserId = user._id;
        if (!confirm('Are you sure you want to put this document ON HOLD?')) return;
        let remarks = prompt('Optional: Enter a reason for putting this document on hold:', '');
        try {
            const res = await fetch(`https://trackit-backend-xu6a.onrender.com/api/documents/${docId}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'hold',
                    office_id: myOfficeId,
                    user_id: myUserId,
                    remarks: remarks || 'Document put on hold'
                })
            });
            if (!res.ok) throw new Error('Failed to put document on hold');
            alert('Document put ON HOLD.');
            await fetchAndRenderIncomingDocs();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function declineDocument(docId) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const myOfficeId = user.office_id?._id || user.office_id;
        const myUserId = user._id;
        if (!confirm('Are you sure you want to DECLINE this document?')) return;
        let remarks = prompt('Optional: Enter a reason for declining this document:', '');
        try {
            const res = await fetch(`https://trackit-backend-xu6a.onrender.com/api/documents/${docId}/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'decline',
                    office_id: myOfficeId,
                    user_id: myUserId,
                    remarks: remarks || 'Document declined'
                })
            });
            if (!res.ok) throw new Error('Failed to decline document');
            alert('Document DECLINED.');
            await fetchAndRenderIncomingDocs();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    // On page load, also fetch incoming docs
    await fetchAndRenderIncomingDocs();

    // When switching to Incoming section, call fetchAndRenderIncomingDocs()
    // Example:
    // document.querySelector('.nav-link[data-section="incoming"]').addEventListener('click', fetchAndRenderIncomingDocs);

    // Add after documentTypes and loadDocumentTypes
    async function populateOutgoingOfficeDropdown() {
        try {
            const res = await fetch('https://trackit-backend-xu6a.onrender.com/api/offices');
            const offices = await res.json();
            console.log('Fetched offices:', offices);
            const officeSelect = document.getElementById('outgoingDocOffice');
            if (!officeSelect) {
                console.error('Dropdown not found!');
                return;
            }
            officeSelect.innerHTML = '<option value="">-- Select Office --</option>';
            offices.forEach(office => {
                officeSelect.innerHTML += `<option value="${office._id}">${office.office_name}</option>`;
            });
            console.log('Dropdown populated!');
        } catch (err) {
            console.error('Error populating dropdown:', err);
        }
    }
    await populateOutgoingOfficeDropdown();

    // Expose document action functions globally for HTML onclick
    window.receiveDocument = receiveDocument;
    window.holdDocument = holdDocument;
    window.declineDocument = declineDocument;
});