// ====== LÓGICA DE CERRAR CAJA ======
function openCloseRegister() {
    document.getElementById('close-register-datetime').innerHTML = new Date().toLocaleString('es-PA');

    const sales = JSON.parse(localStorage.getItem('parriPOS_sales') || '[]');

    let totalSales = 0;
    const methodTotals = {
        'Efectivo': 0,
        'Yappy': 0,
        'Tarjeta': 0
    };

    sales.forEach(sale => {
        totalSales += sale.total;
        if (methodTotals[sale.method] !== undefined) {
            methodTotals[sale.method] += sale.total;
        }
    });

    domNodes.summaryCount.textContent = sales.length;
    domNodes.summaryTotal.textContent = `$${totalSales.toFixed(2)}`;

    domNodes.summaryMethodsList.innerHTML = '';
    for (const [method, amount] of Object.entries(methodTotals)) {
        domNodes.summaryMethodsList.innerHTML += `
            <li>
                <span>${method}</span>
                <strong>$${amount.toFixed(2)}</strong>
            </li>
        `;
    }

    domNodes.closeRegisterModal.classList.remove('hidden');
}


function ejecutarBorrado() {
    localStorage.removeItem('parriPOS_sales');
    localStorage.removeItem('parriPOS_orderCount');
    domNodes.verifyResetModal.classList.add('hidden');
    domNodes.closeRegisterModal.classList.add('hidden');
    showToast('Caja reiniciada con éxito.', 'success');
}
