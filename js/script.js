// ====== DOM NODES MAIN REFERENCES ======
// Deben ser accesibles por los demás scripts cargados en el index.html
const domNodes = {
    productsGrid: document.getElementById('products-grid'),
    orderList: document.getElementById('order-list'),
    orderTotal: document.getElementById('order-total'),
    btnCheckout: document.getElementById('btn-checkout'),

    // Modales
    checkoutModal: document.getElementById('checkout-modal'),
    closeRegisterModal: document.getElementById('close-register-modal'),
    verifyResetModal: document.getElementById('verify-reset-modal'),

    // Checkout Elements
    checkoutTotalAmount: document.getElementById('checkout-total-amount'),
    cashReceived: document.getElementById('cash-received'),
    changeAmount: document.getElementById('change-amount'),
    cashSection: document.getElementById('cash-section'),
    paymentBtns: document.querySelectorAll('.payment-btn'),
    quickCashBtns: document.querySelectorAll('.btn-quick-cash'),

    // Botones Modales
    btnCancelCheckout: document.getElementById('btn-cancel-checkout'),
    btnConfirmSale: document.getElementById('btn-confirm-sale'),
    btnCerrarCaja: document.getElementById('btn-cerrar-caja'),
    btnCloseSummary: document.getElementById('btn-close-summary'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    btnResetRegister: document.getElementById('btn-reset-register'),
    btnCancelReset: document.getElementById('btn-cancel-reset'),
    btnConfirmResetStrict: document.getElementById('btn-confirm-reset-strict'),

    // Resumen
    summaryCount: document.getElementById('summary-count'),
    summaryTotal: document.getElementById('summary-total'),
    summaryMethodsList: document.getElementById('summary-methods-list')
};

// ====== INICIALIZACIÓN ======
function init() {
    renderProducts();
    setupEventListeners();
    updateOrderDisplay();
    registerServiceWorker();
}


// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Checkout Modal
    domNodes.btnCheckout.addEventListener('click', openCheckout);
    domNodes.btnCancelCheckout.addEventListener('click', closeCheckout);

    // Métodos de pago
    domNodes.paymentBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            domNodes.paymentBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            selectedPaymentMethod = target.dataset.method;

            if (selectedPaymentMethod === 'Efectivo') {
                domNodes.cashSection.style.display = 'block';
                domNodes.cashReceived.value = '';
                calculateChange();
                setTimeout(() => domNodes.cashReceived.focus(), 100);
            } else {
                domNodes.cashSection.style.display = 'none';
            }
        });
    });

    // Event listeners para Quick Cash
    domNodes.quickCashBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const amountAttr = e.target.dataset.amount;
            const currentTotal = parseFloat(domNodes.checkoutTotalAmount.textContent.replace('$', '')) || 0;

            if (amountAttr === 'exact') {
                domNodes.cashReceived.value = currentTotal.toFixed(2);
            } else {
                domNodes.cashReceived.value = parseFloat(amountAttr).toFixed(2);
            }

            calculateChange();
        });
    });

    // Calcular cambio manual
    domNodes.cashReceived.addEventListener('input', calculateChange);

    // Confirmar Venta
    domNodes.btnConfirmSale.addEventListener('click', confirmSale);

    // Cerrar Caja
    domNodes.btnCerrarCaja.addEventListener('click', openCloseRegister);
    domNodes.btnCloseSummary.addEventListener('click', () => {
        domNodes.closeRegisterModal.classList.add('hidden');
    });

    // Imprimir PDF
    domNodes.btnExportPdf.addEventListener('click', () => {
        window.print();
    });

    // Reiniciar Caja (Abre Modal de Confirmación)
    domNodes.btnResetRegister.addEventListener('click', () => {
        domNodes.verifyResetModal.classList.remove('hidden');
    });

    domNodes.btnCancelReset.addEventListener('click', () => {
        domNodes.verifyResetModal.classList.add('hidden');
    });

    domNodes.btnConfirmResetStrict.addEventListener('click', ejecutarBorrado);

    // Close modales clicando fuera
    window.addEventListener('click', (e) => {
        if (e.target === domNodes.checkoutModal) {
            closeCheckout();
        }
        if (e.target === domNodes.closeRegisterModal) {
            domNodes.closeRegisterModal.classList.add('hidden');
        }
        if (e.target === domNodes.verifyResetModal) {
            domNodes.verifyResetModal.classList.add('hidden');
        }
    });
}


// ====== PWA SERVICE WORKER ======
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW Registered', reg))
                .catch(err => console.error('SW Error', err));
        });
    }
}

// Arrancar app al cargar DOM
document.addEventListener('DOMContentLoaded', init);
