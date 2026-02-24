// ====== CONFIGuración de Productos ======
const PRODUCTS = [
    { id: 1, name: "Picada pequeña", price: 5.00 },
    { id: 2, name: "Picada grande", price: 8.00 },
    { id: 3, name: "1/2 pollo", price: 6.00 },
    { id: 4, name: "Costilla natural", price: 7.00 },
    { id: 5, name: "Yuca frita", price: 3.00 },
    { id: 6, name: "Papas fritas", price: 3.00 }
];

// ====== ESTADO DE LA APP ======
let currentOrder = [];
let selectedPaymentMethod = "Efectivo";

// Referencias DOM
const domNodes = {
    productsGrid: document.getElementById('products-grid'),
    orderList: document.getElementById('order-list'),
    orderTotal: document.getElementById('order-total'),
    btnCheckout: document.getElementById('btn-checkout'),

    // Modales
    checkoutModal: document.getElementById('checkout-modal'),
    closeRegisterModal: document.getElementById('close-register-modal'),

    // Checkout Elements
    checkoutTotalAmount: document.getElementById('checkout-total-amount'),
    cashReceived: document.getElementById('cash-received'),
    changeAmount: document.getElementById('change-amount'),
    cashSection: document.getElementById('cash-section'),
    paymentBtns: document.querySelectorAll('.payment-btn'),

    // Botones Modales
    btnCancelCheckout: document.getElementById('btn-cancel-checkout'),
    btnConfirmSale: document.getElementById('btn-confirm-sale'),
    btnCerrarCaja: document.getElementById('btn-cerrar-caja'),
    btnCloseSummary: document.getElementById('btn-close-summary'),
    btnExportPdf: document.getElementById('btn-export-pdf'),
    btnResetRegister: document.getElementById('btn-reset-register'),

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

// ====== RENDERIZADO ======
function renderProducts() {
    domNodes.productsGrid.innerHTML = '';
    PRODUCTS.forEach(product => {
        const btn = document.createElement('div');
        btn.className = 'product-btn';
        btn.innerHTML = `
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toFixed(2)}</span>
        `;
        btn.addEventListener('click', () => addToOrder(product));
        domNodes.productsGrid.appendChild(btn);
    });
}

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

// ====== LÓGICA DEL PEDIDO ======
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

// Need to make these available globally for onclick handlers in innerHTML
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

    // Calcular cambio
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

    // Reiniciar Caja con biometría (FaceID/TouchID/Contraseña del dispositivo)
    domNodes.btnResetRegister.addEventListener('click', async () => {
        try {
            // Verificar si el dispositivo soporta WebAuthn
            if (!window.PublicKeyCredential) {
                fallbackDelete();
                return;
            }

            // Crear un desafío local para forzar la UI biométrica del dispositivo local
            const publicKeyCredentialRequestOptions = {
                challenge: Uint8Array.from('admin-reset-challenge', c => c.charCodeAt(0)),
                rpId: window.location.hostname || 'localhost',
                userVerification: "required", // Force FaceID / TouchID / passcode
                timeout: 60000
            };

            // Esto llama al sistema operativo (FaceID en iPad, TouchID en Mac, etc)
            await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            // Si llegamos hasta aquí, la autenticación fue exitosa
            ejecutarBorrado();

        } catch (err) {
            console.error(err);
            // El usuario canceló o falló FaceID
            if (err.name === 'NotAllowedError') {
                alert('Cancelado o autenticación fallida. Las ventas están seguras.');
            } else {
                // Posiblemente no soportado o en modo HTTP en vez de HTTPS
                fallbackDelete();
            }
        }
    });

    function ejecutarBorrado() {
        if (confirm('✅ Autenticado. ¿Estás seguro de querer reiniciar la caja? (Esta acción no se puede deshacer)')) {
            localStorage.removeItem('parriPOS_sales');
            domNodes.closeRegisterModal.classList.add('hidden');
            alert('Caja reiniciada con éxito.');
        }
    }

    function fallbackDelete() {
        const pin = prompt('Dispositivo sin FaceID o en modo inseguro.\nSe requiere PIN (1234):');
        if (pin === '2005') {
            ejecutarBorrado();
        } else if (pin !== null) {
            alert('PIN Incorrecto. Operación cancelada.');
        }
    }

    // Close modales clicando fuera
    window.addEventListener('click', (e) => {
        if (e.target === domNodes.checkoutModal) {
            closeCheckout();
        }
        if (e.target === domNodes.closeRegisterModal) {
            domNodes.closeRegisterModal.classList.add('hidden');
        }
    });
}

// ====== LÓGICA DE CHECKOUT ======
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
            alert('El dinero recibido es menor al total.');
            return;
        }
    }

    // Save to LocalStorage
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...currentOrder],
        total: total,
        method: selectedPaymentMethod
    };

    const prevSales = JSON.parse(localStorage.getItem('parriPOS_sales') || '[]');
    prevSales.push(sale);
    localStorage.setItem('parriPOS_sales', JSON.stringify(prevSales));

    // Finish
    currentOrder = [];
    updateOrderDisplay();
    closeCheckout();

    // Feedback visual opcional
    const origText = domNodes.btnCheckout.textContent;
    domNodes.btnCheckout.textContent = '¡Venta Registrada!';
    domNodes.btnCheckout.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        domNodes.btnCheckout.textContent = origText;
        domNodes.btnCheckout.style.backgroundColor = '';
    }, 2000);
}

// ====== LÓGICA DE CERRAR CAJA ======
function openCloseRegister() {
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
