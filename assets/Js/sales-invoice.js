const apiBaseUrl = 'http://localhost:5178/api';
let authUser = null;
let customers = [];
let parts = [];
let invoiceItems = [];

window.onload = () => {
    const stored = localStorage.getItem('driveSewaUser');
    if (!stored) {
        window.location.href = '../../public/login.html';
        return;
    }

    authUser = JSON.parse(stored);
    if (authUser.role !== 'Admin' && authUser.role !== 'Staff') {
        window.location.href = '../../public/login.html';
        return;
    }

    loadCustomers();
    loadParts();
    updateSummary();
};

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authUser.token}`
    };
}

function logout() {
    localStorage.removeItem('driveSewaUser');
    window.location.href = '../../public/login.html';
}

async function loadCustomers() {
    try {
        const response = await fetch(`${apiBaseUrl}/customers`);
        customers = await response.json();
        const select = document.getElementById('customerId');
        select.innerHTML = '<option value="">Select customer</option>' + customers.map(customer =>
            `<option value="${customer.customerId}">${customer.fullName} (${customer.phone || customer.email})</option>`
        ).join('');
    } catch (err) {
        document.getElementById('customerId').innerHTML = '<option value="">Unable to load customers</option>';
    }
}

async function loadParts() {
    try {
        const response = await fetch(`${apiBaseUrl}/parts`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Unable to load parts');
        }

        parts = await response.json();
        const select = document.getElementById('partId');
        select.innerHTML = '<option value="">Select part</option>' + parts.map(part =>
            `<option value="${part.partId}">${part.partName} - Rs. ${Number(part.price).toFixed(2)} (${part.quantity} in stock)</option>`
        ).join('');
    } catch (err) {
        document.getElementById('partId').innerHTML = '<option value="">Unable to load parts</option>';
    }
}

function addItem() {
    const partId = parseInt(document.getElementById('partId').value, 10);
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const part = parts.find(item => item.partId === partId);

    if (!part) {
        alert('Please select a part.');
        return;
    }

    if (!quantity || quantity <= 0) {
        alert('Quantity must be at least 1.');
        return;
    }

    if (quantity > part.quantity) {
        alert(`Only ${part.quantity} items are available in stock.`);
        return;
    }

    const existing = invoiceItems.find(item => item.partId === partId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        invoiceItems.push({
            partId: part.partId,
            partName: part.partName,
            quantity: quantity,
            unitPrice: Number(part.price)
        });
    }

    renderItems();
    updateSummary();
}

function removeItem(partId) {
    invoiceItems = invoiceItems.filter(item => item.partId !== partId);
    renderItems();
    updateSummary();
}

function renderItems() {
    const container = document.getElementById('itemsContainer');
    if (invoiceItems.length === 0) {
        container.innerHTML = '<p style="color: var(--muted);">No items added.</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr><th>Part</th><th>Quantity</th><th>Unit Price</th><th>Total</th><th>Action</th></tr>
            </thead>
            <tbody>
                ${invoiceItems.map(item => `
                    <tr>
                        <td>${item.partName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.unitPrice)}</td>
                        <td>${formatCurrency(item.quantity * item.unitPrice)}</td>
                        <td><button type="button" class="btn btn-danger" onclick="removeItem(${item.partId})">Remove</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function calculateTotals() {
    const subTotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const isDiscountApplied = subTotal > 5000;
    const discountAmount = isDiscountApplied ? subTotal * 0.10 : 0;
    const finalTotal = subTotal - discountAmount;
    return { subTotal, isDiscountApplied, discountAmount, finalTotal };
}

function updateSummary() {
    const totals = calculateTotals();
    const message = document.getElementById('discountMessage');
    document.getElementById('subTotal').textContent = formatCurrency(totals.subTotal);
    document.getElementById('discountAmount').textContent = formatCurrency(totals.discountAmount);
    document.getElementById('finalTotal').textContent = formatCurrency(totals.finalTotal);

    if (totals.isDiscountApplied) {
        message.textContent = 'Loyalty Discount Applied: 10%';
        message.classList.add('applied');
    } else {
        message.textContent = 'No loyalty discount applied';
        message.classList.remove('applied');
    }
}

async function submitInvoice() {
    const customerId = parseInt(document.getElementById('customerId').value, 10);
    if (!customerId) {
        alert('Please select a customer.');
        return;
    }

    if (invoiceItems.length === 0) {
        alert('Please add at least one item.');
        return;
    }

    const payload = {
        customerId: customerId,
        items: invoiceItems.map(item => ({
            partId: item.partId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }))
    };

    try {
        const response = await fetch(`${apiBaseUrl}/sales-invoices`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok) {
            alert(result.message || result || 'Failed to create sales invoice.');
            return;
        }

        alert(`Invoice created. Final payable: ${formatCurrency(result.finalTotal || result.finalAmount)}`);
        invoiceItems = [];
        renderItems();
        updateSummary();
        loadParts();
    } catch (err) {
        alert('Network error while creating sales invoice.');
    }
}

function formatCurrency(value) {
    return `Rs. ${Number(value || 0).toFixed(2)}`;
}
