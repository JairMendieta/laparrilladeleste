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
                        <button class="qty-btn" onclick="modifyQty(${index}, -1)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg></button>
                        <span class="item-qty">${item.quantity}</span>
                        <button class="qty-btn" onclick="modifyQty(${index}, 1)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14"/></svg></button>
                    </div>
                    <button class="btn-remove" onclick="removeItem(${index})"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"/></svg></button>
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
