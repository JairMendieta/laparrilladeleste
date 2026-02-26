// ====== LÓGICA DE HISTORIAL DE VENTAS (MÓDULO SEPARADO) ======

document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});

function renderHistory() {
    const sales = JSON.parse(localStorage.getItem('parriPOS_sales') || '[]');
    const tbody = document.getElementById('history-items-list');
    const emptyState = document.getElementById('history-empty-state');

    // El div contenedor blanco con el borde que envuelve a la tabla
    const tableContainer = document.getElementById('history-table').closest('div').parentElement;

    if (!tbody || !emptyState || !tableContainer) return;

    tbody.innerHTML = '';

    if (sales.length === 0) {
        tableContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        tableContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');

        // Renderizar las ventas más recientes primero
        const reversedSales = [...sales].reverse();

        reversedSales.forEach(sale => {
            const timeStr = sale.date ? new Date(sale.date).toLocaleTimeString('es-PA', { hour: '2-digit', minute: '2-digit' }) : '-';
            const itemsArray = Array.isArray(sale.items) ? sale.items : [];
            const itemsDetail = itemsArray.map(i => `<strong>${i.quantity}x</strong> ${i.name}`).join("<br>");

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid var(--border-color)';
            tr.innerHTML = `
                <td style="padding: 16px 20px;">#<strong>${sale.orderNumber || '-'}</strong></td>
                <td style="padding: 16px 20px;">${timeStr}</td>
                <td style="padding: 16px 20px; text-align: right; font-weight: bold; color: var(--primary-color);">$${(sale.total || 0).toFixed(2)}</td>
                <td style="padding: 16px 20px;">
                    <span style="background: var(--bg-color); padding: 6px 12px; border-radius: 6px; font-size: 0.9em; font-weight: 500;">
                        ${sale.method || 'Efectivo'}
                    </span>
                </td>
                <td style="padding: 16px 20px; font-size: 0.95em; line-height: 1.5;">${itemsDetail}</td>
                <td style="padding: 16px 20px; text-align: center;">
                    <button class="btn-icon" style="background: none; border: none; cursor: pointer; color: var(--primary-color); display: inline-flex; align-items: center; justify-content: center; padding: 8px; border-radius: 6px; transition: background 0.2s ease;" title="Descargar Factura" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='none'" onclick="if(window.downloadReceipt) downloadReceipt('${sale.orderNumber}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2v6.5a1.5 1.5 0 0 0 1.5 1.5H20v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 9a1 1 0 0 0-1 1v2.708l-.414-.414a1 1 0 0 0-1.414 1.414l2.12 2.122a1 1 0 0 0 1.415 0l2.121-2.122a1 1 0 1 0-1.414-1.414l-.414.414V12a1 1 0 0 0-1-1m2-8.957a2 2 0 0 1 1 .543L19.414 7a2 2 0 0 1 .543 1H14Z"/></g></svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

/**
 * Función para reimprimir/descargar una factura del historial.
 * @param {string} orderNumber - El número de orden de la venta a imprimir.
 */
window.downloadReceipt = function (orderNumber) {
    const sales = JSON.parse(localStorage.getItem('parriPOS_sales') || '[]');
    const sale = sales.find(s => s.orderNumber === orderNumber);

    if (!sale) {
        if (window.showToast) {
            showToast('No se encontró la venta especificada.', 'error');
        } else {
            alert('No se encontró la venta especificada.');
        }
        return;
    }

    // Usar la función de receipt.js para llenar el DOM oculto
    if (typeof generateReceiptDOM === 'function') {
        const fakeCashReceivedInput = sale.method === 'Efectivo' ? sale.total : null;
        generateReceiptDOM(sale, fakeCashReceivedInput);

        // Imprimir usando la lógica nativa del navegador
        const originalTitle = document.title;
        const dateStr = new Date(sale.date).toLocaleDateString('es-PA').replace(/\//g, '-');
        const orderStr = sale.orderNumber || '00';
        document.title = `ParriPOS_Historial_${orderStr}_${dateStr}`;

        document.body.classList.add('printing-receipt');

        // Llamar a imprimir
        window.print();

        // Restaurar el título original después de imprimir
        document.title = originalTitle;

        setTimeout(() => {
            document.body.classList.remove('printing-receipt');
        }, 1000);
    } else {
        console.error('La función generateReceiptDOM no está disponible. Asegúrese de que receipt.js esté cargado.');
    }
};
