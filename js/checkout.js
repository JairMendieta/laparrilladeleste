// ====== ESTADO DE PAGO ======
let selectedPaymentMethod = "Efectivo";

function openCheckout() {
    const total = updateOrderDisplay();
    if (total <= 0) return;

    // Resetear a Efectivo
    selectedPaymentMethod = 'Efectivo';
    domNodes.paymentBtns.forEach(b => b.classList.remove('active'));
    domNodes.paymentBtns[0].classList.add('active');

    domNodes.cashSection.style.display = 'block';
    domNodes.cashReceived.value = '';
    domNodes.changeAmount.textContent = '$0.00';
    domNodes.changeAmount.style.color = '#4CAF50';
    domNodes.checkoutTotalAmount.textContent = `$${total.toFixed(2)}`;

    domNodes.checkoutModal.classList.remove('hidden');
    setTimeout(() => { domNodes.cashReceived.focus() }, 100);
}

function closeCheckout() {
    domNodes.checkoutModal.classList.add('hidden');
}

function calculateChange() {
    const totalText = domNodes.checkoutTotalAmount.textContent.replace('$', '');
    const total = parseFloat(totalText) || 0;
    const receivedText = domNodes.cashReceived.value;
    const received = receivedText ? parseFloat(receivedText) : 0;

    const change = received - total;
    if (change >= 0) {
        domNodes.changeAmount.textContent = `$${change.toFixed(2)}`;
        domNodes.changeAmount.style.color = '#4CAF50';
    } else {
        domNodes.changeAmount.textContent = `Falta $${Math.abs(change).toFixed(2)}`;
        domNodes.changeAmount.style.color = 'var(--danger)';
    }
}

function confirmSale() {
    const total = updateOrderDisplay();

    if (selectedPaymentMethod === 'Efectivo') {
        const received = parseFloat(domNodes.cashReceived.value) || 0;
        if (received < total) {
            showToast('Efectivo insuficiente para cobro exacto.', 'error');
            return;
        }
    }

    // Incrementar número de orden
    let orderCount = parseInt(localStorage.getItem('parriPOS_orderCount') || '0', 10);
    orderCount++;
    localStorage.setItem('parriPOS_orderCount', orderCount.toString());

    // Prepare Sale Record
    const saleId = Date.now();
    const sale = {
        id: saleId,
        orderNumber: orderCount.toString().padStart(2, '0'),
        date: new Date().toISOString(),
        items: [...currentOrder],
        total: total,
        method: selectedPaymentMethod
    };

    // Save to LocalStorage
    const prevSales = JSON.parse(localStorage.getItem('parriPOS_sales') || '[]');
    prevSales.push(sale);
    localStorage.setItem('parriPOS_sales', JSON.stringify(prevSales));

    // Generar Recibo Automático
    generateReceiptDOM(sale, domNodes.cashReceived.value);

    // Auto-Close and Finish
    currentOrder = [];
    updateOrderDisplay();
    closeCheckout();

    // Trigger Print
    triggerPrintReceipt(sale);

    // Feedback visual opcional
    const origText = domNodes.btnCheckout.textContent;
    domNodes.btnCheckout.textContent = '¡Venta Lista!';
    domNodes.btnCheckout.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        domNodes.btnCheckout.textContent = origText;
        domNodes.btnCheckout.style.backgroundColor = '';
    }, 1500);
}


