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
    
    loadReviews();
};

function toggleReviewForm() {
    const form = document.getElementById('reviewFormWrapper');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        document.getElementById('reviewForm').reset();
    } else {
        form.style.display = 'none';
    }
}

async function loadReviews() {
    try {
        const res = await fetch(`${apiBaseUrl}/review/customer/${customerData.userId}`);
        const reviews = await res.json();
        const container = document.getElementById('reviewsContainer');
        
        if(reviews.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--secondary);">You have not submitted any reviews yet.</p>';
            return;
        }

        container.innerHTML = reviews.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="rating-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                    <span style="color: var(--secondary); font-size: 13px;">${new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div style="margin-top: 8px;">${r.comment}</div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('reviewsContainer').innerHTML = '<p style="color:red;">Error loading reviews.</p>';
    }
}

document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        customerId: customerData.userId,
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('comment').value.trim()
    };

    try {
        const res = await fetch(`${apiBaseUrl}/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            toggleReviewForm();
            loadReviews();
            alert('Review submitted successfully!');
        } else {
            const err = await res.json();
            alert(err.message || 'Failed to submit review');
        }
    } catch (err) { 
        alert('Error submitting review'); 
    }
});
