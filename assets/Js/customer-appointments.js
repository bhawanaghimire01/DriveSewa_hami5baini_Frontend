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
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;

    loadVehicles();
    loadAppointments();
};

function toggleAppointmentForm() {
    const form = document.getElementById('appointmentFormWrapper');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        document.getElementById('appointmentForm').reset();
    } else {
        form.style.display = 'none';
    }
}

async function loadVehicles() {
    try {
        const res = await fetch(`${apiBaseUrl}/customers/${customerData.userId}/vehicles`);
        const vehicles = await res.json();
        const select = document.getElementById('vehId');
        
        if (vehicles.length === 0) {
            select.innerHTML = '<option value="">No vehicles found - Please add a vehicle first</option>';
            return;
        }

        select.innerHTML = '<option value="">Select a vehicle</option>' + vehicles.map(v => 
            `<option value="${v.vehicleId}">${v.brand} ${v.model} (${v.vehicleNumber})</option>`
        ).join('');
    } catch (err) {
        console.error('Error loading vehicles', err);
    }
}

async function loadAppointments() {
    try {
        const res = await fetch(`${apiBaseUrl}/appointment/customer/${customerData.userId}`);
        const appointments = await res.json();
        const container = document.getElementById('appointmentsTableContainer');
        
        if(appointments.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--secondary);">No appointments found. Book one above.</p>';
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr><th>Date</th><th>Service Type</th><th>Vehicle</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${appointments.map(a => `
                        <tr>
                            <td>${new Date(a.appointmentDate).toLocaleString()}</td>
                            <td>${a.serviceType}</td>
                            <td>${a.vehicleName}</td>
                            <td><span class="status-badge status-${a.status}">${a.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        document.getElementById('appointmentsTableContainer').innerHTML = '<p style="color:red;">Error loading appointments.</p>';
    }
}

document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dateStr = document.getElementById('appointmentDate').value;
    const timeStr = document.getElementById('appointmentTime').value;
    const combinedDate = new Date(`${dateStr}T${timeStr}`);

    const payload = {
        customerId: customerData.userId,
        vehicleId: parseInt(document.getElementById('vehId').value),
        appointmentDate: combinedDate.toISOString(),
        serviceType: document.getElementById('serviceType').value
    };

    try {
        const res = await fetch(`${apiBaseUrl}/appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            toggleAppointmentForm();
            loadAppointments();
            alert('Appointment booked successfully!');
        } else {
            const err = await res.json();
            alert(err.message || 'Failed to book appointment');
        }
    } catch (err) { 
        alert('Error booking appointment'); 
    }
});
