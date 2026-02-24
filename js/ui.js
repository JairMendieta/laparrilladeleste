// ====== SHARED UTILITIES ======

/**
 * Muestra una notificación emergente (Toast) en pantalla
 * @param {string} message - El texto a mostrar
 * @param {string} type - 'success', 'error', 'warning', or 'info' (default)
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Iconos opcionales según el tipo (puedes usar SVGs)
    let iconHTML = '';
    if (type === 'success') {
        iconHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }

    toast.innerHTML = `
        ${iconHTML}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.add('hiding');
        // Esperar que termine la animación css para matarlo del DOM
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}
