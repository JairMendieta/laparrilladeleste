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
            `;
            tbody.appendChild(tr);
        });
    }
}
