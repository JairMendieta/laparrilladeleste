// ====== ESTADO DE LA APP: Pedido Actual ======
let currentOrder = [];

function updateOrderDisplay() {
    domNodes.orderList.innerHTML = '';
    let total = 0;

    if (currentOrder.length === 0) {
        domNodes.orderList.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding-top:40px; font-size:18px;">El pedido está vacío</div>';
        domNodes.btnCheckout.disabled = true;
    } else {
        domNodes.btnCheckout.disabled = false;

        currentOrder.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)} c/u</div>
                </div>
                <div class="item-controls">
                    <div class="qty-control" onclick="event.stopPropagation()">
                        <button class="qty-btn" onclick="modifyQty(${index}, -1)">-</button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="modifyQty(${index}, 1)">+</button>
                    </div>
                    <button class="btn-remove" onclick="removeItem(${index})">×</button>
                </div>
            `;
            domNodes.orderList.appendChild(div);
        });
    }

    domNodes.orderTotal.textContent = `$${total.toFixed(2)}`;
    return total;
}

function addToOrder(product) {
    const existingIndex = currentOrder.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
        currentOrder[existingIndex].quantity++;
    } else {
        currentOrder.push({ ...product, quantity: 1 });
    }
    updateOrderDisplay();

    // Auto scroll to bottom
    setTimeout(() => {
        domNodes.orderList.scrollTop = domNodes.orderList.scrollHeight;
    }, 50);
}

// Global functions for inline HTML onclick handlers
window.modifyQty = function (index, delta) {
    currentOrder[index].quantity += delta;
    if (currentOrder[index].quantity <= 0) {
        currentOrder.splice(index, 1);
    }
    updateOrderDisplay();
};

window.removeItem = function (index) {
    currentOrder.splice(index, 1);
    updateOrderDisplay();
};
