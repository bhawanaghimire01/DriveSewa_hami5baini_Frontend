const apiBaseUrl = 'http://localhost:5178/api';
let customerData = null;
let customerId = null;

window.onload = () => {
    const stored = localStorage.getItem('driveSewaCustomer');
    if (!stored) {
        window.location.href = '../../public/login.html';
        return;
    }

    customerData = JSON.parse(stored);
    if (customerData.role !== 'Customer') {
        logout();
        return;
    }

    customerId = customerData.customerId || customerData.userId;
    document.getElementById('headerName').textContent = customerData.fullName;

    setupTabs();
    loadHistory();
};

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.history-section').forEach(section => section.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(button.dataset.target).classList.add('active');
        });
    });
}

function getAuthHeaders() {
    return {
        'Authorization': `Bearer ${customerData.token}`
    };
}

async function loadHistory() {
    try {
        const response = await fetch(`${apiBaseUrl}/customerhistory/${customerId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }

            throw new Error('Failed to load history');
        }

        const history = await response.json();
        renderPurchases(history.purchases || []);
        renderServices(history.services || []);
    } catch (err) {
        document.getElementById('purchaseHistoryContainer').innerHTML = '<p class="empty-state">Unable to load purchase history.</p>';
        document.getElementById('serviceHistoryContainer').innerHTML = '<p class="empty-state">Unable to load service history.</p>';
    }
}

function renderPurchases(purchases) {
    const container = document.getElementById('purchaseHistoryContainer');

    if (purchases.length === 0) {
        container.innerHTML = '<p class="empty-state">No history found.</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Discount</th>
                </tr>
            </thead>
            <tbody>
                ${purchases.map(purchase => `
                    <tr>
                        <td style="font-weight: 600;">${purchase.invoiceNo}</td>
                        <td>${formatDate(purchase.purchaseDate)}</td>
                        <td>${formatItems(purchase.items || [])}</td>
                        <td>${formatCurrency(purchase.totalAmount)}</td>
                        <td>${formatCurrency(purchase.discountAmount)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderServices(services) {
    const container = document.getElementById('serviceHistoryContainer');

    if (services.length === 0) {
        container.innerHTML = '<p class="empty-state">No history found.</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Vehicle</th>
                    <th>Service Type</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${services.map(service => `
                    <tr>
                        <td>${formatDate(service.serviceDate)}</td>
                        <td>${service.vehicle || '-'}</td>
                        <td>${service.serviceType || '-'}</td>
                        <td>${service.description || '-'}</td>
                        <td><span class="status-badge status-${service.status}">${service.status || '-'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatItems(items) {
    if (items.length === 0) {
        return '-';
    }

    return items.map(item => `${item.partName} x ${item.quantity}`).join('<br>');
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString();
}

function formatCurrency(value) {
    const amount = Number(value || 0);
    return `Rs. ${amount.toFixed(2)}`;
}
