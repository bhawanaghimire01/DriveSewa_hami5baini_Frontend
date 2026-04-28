const apiBaseUrl = 'http://localhost:5178/api';
let customerData = null;

window.onload = () => {
    const stored = localStorage.getItem('driveSewaCustomer');
    if(!stored) {
        window.location.href = '../../public/login.html';
        return;
    }
    customerData = JSON.parse(stored);
    if(customerData.role !== 'Customer') {
        logout();
        return;
    }
    document.getElementById('headerName').textContent = customerData.fullName;
    
    loadPartRequests();
};

function togglePartRequestForm() {
    const form = document.getElementById('partRequestFormWrapper');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        document.getElementById('partRequestForm').reset();
    } else {
        form.style.display = 'none';
    }
}

async function loadPartRequests() {
    try {
        const res = await fetch(`${apiBaseUrl}/partrequests/customer/${customerData.userId}`);
        const requests = await res.json();
        const container = document.getElementById('partRequestsTableContainer');
        
        if(requests.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--secondary);">No part requests found.</p>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr><th>Part Name</th><th>Description</th><th>Requested At</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${requests.map(r => `
                        <tr>
                            <td style="font-weight: 600;">${r.partName}</td>
                            <td>${r.description || '-'}</td>
                            <td>${new Date(r.requestedAt).toLocaleDateString()}</td>
                            <td><span class="status-badge status-${r.status}">${r.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        document.getElementById('partRequestsTableContainer').innerHTML = '<p style="color:red;">Error loading requests.</p>';
    }
}

document.getElementById('partRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        customerId: customerData.userId,
        partName: document.getElementById('partName').value.trim(),
        description: document.getElementById('description').value.trim()
    };

    try {
        const res = await fetch(`${apiBaseUrl}/partrequests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            togglePartRequestForm();
            loadPartRequests();
            alert('Part request submitted successfully!');
        } else {
            const err = await res.json();
            alert(err.message || 'Failed to submit request');
        }
    } catch (err) { 
        alert('Error submitting part request'); 
    }
});
