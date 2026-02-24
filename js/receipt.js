// ====== LÓGICA DE RECIBOS Y TÉRMICA ======

/**
 * Llena el DOM oculto con los datos de la venta para poder imprimirlo.
 * @param {Object} sale - El objeto de la venta confirmada
 * @param {string} cashReceivedInput - El valor del input de pago en efectivo
 */
function generateReceiptDOM(sale, cashReceivedInput) {
    document.getElementById('receipt-order-no').textContent = sale.orderNumber || '00';
    document.getElementById('receipt-date').innerHTML = new Date(sale.date).toLocaleString('es-PA');

    const tbody = document.getElementById('receipt-items-list');
    tbody.innerHTML = '';

    sale.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.quantity}</td>
            <td>${item.name}</td>
            <td style="text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('receipt-total-amount').textContent = `$${sale.total.toFixed(2)}`;
    document.getElementById('receipt-method').textContent = sale.method;

    if (sale.method === 'Efectivo') {
        const received = parseFloat(cashReceivedInput) || sale.total;
        document.getElementById('receipt-cash').textContent = `$${received.toFixed(2)}`;
        document.getElementById('receipt-change').textContent = `$${(received - sale.total).toFixed(2)}`;
    } else {
        document.getElementById('receipt-cash').textContent = 'N/A';
        document.getElementById('receipt-change').textContent = 'N/A';
    }
}

let currentCompletedSale = null;

/**
 * Muestra el modal interceptor que pregunta si imprimir o descargar.
 * @param {Object} sale - El objeto de la venta recién confirmada
 */
function openReceiptOptions(sale) {
    currentCompletedSale = sale;
    domNodes.optionsOrderNo.textContent = sale.orderNumber || '00';
    domNodes.printOptionsModal.classList.remove('hidden');
}

/**
 * Ejecuta la antigua lógica nativa de impresión `window.print`
 */
function executePrint() {
    if (!currentCompletedSale) return;
    const sale = currentCompletedSale;

    // Generar un nombre de archivo sugerido: "ParriPOS - Orden 01 - 23-10-2023"
    const originalTitle = document.title;
    const dateStr = new Date(sale.date).toLocaleDateString('es-PA').replace(/\//g, '-');
    const orderStr = sale.orderNumber || '00';
    document.title = `ParriPOS_Orden_${orderStr}_${dateStr}`;

    document.body.classList.add('printing-receipt');

    // Llamar a imprimir (esto pausa la ejecución del script hasta que se cierre el diálogo)
    window.print();

    // Restaurar el título original después de imprimir
    document.title = originalTitle;

    // Remove class after print dialog is closed
    setTimeout(() => {
        document.body.classList.remove('printing-receipt');
    }, 1000);

    closeReceiptOptions();
}

function closeReceiptOptions() {
    domNodes.printOptionsModal.classList.add('hidden');
    currentCompletedSale = null;
}

// Inicializar event listeners específicos de esta ventana modal
document.addEventListener('DOMContentLoaded', () => {
    domNodes.btnActionPrint.addEventListener('click', executePrint);
    domNodes.btnActionSkip.addEventListener('click', closeReceiptOptions);
});
