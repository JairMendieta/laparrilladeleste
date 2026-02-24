// ====== CONFIGuración de Productos ======
const PRODUCTS = [
    // PICADAS MIXTAS
    { id: 1, name: "Picada pequeña", description: "cerdo res y chorizo", price: 5.00, category: "Picadas Mixtas" },
    { id: 2, name: "Picada grande", description: "cerdo res y chorizo", price: 7.00, category: "Picadas Mixtas" },
    { id: 3, name: "Picada Familiar (4 pax)", description: "cerdo res y chorizo", price: 13.50, category: "Picadas Mixtas" },
    { id: 4, name: "Picada Familiar (6 pax)", description: "cerdo res y chorizo", price: 19.50, category: "Picadas Mixtas" },

    // POLLO
    { id: 5, name: "1/4 pollo", description: "", price: 0.00, category: "Pollo" },
    { id: 6, name: "1/2 pollo", description: "", price: 0.00, category: "Pollo" },
    { id: 7, name: "1 pollo entero", description: "No incluye acompañamiento", price: 0.00, category: "Pollo" },

    // COSTILLAS
    { id: 8, name: "Costilla ahumada", description: "Artesanal (Natural)", price: 2.00, category: "Costillas" },
    { id: 9, name: "Costilla ahumada", description: "Artesanal (BBQ)", price: 2.25, category: "Costillas" },
    { id: 10, name: "Costilla clásica", description: "Al fuego (Natural)", price: 2.75, category: "Costillas" },
    { id: 11, name: "Costilla clásica", description: "Al fuego (BBQ)", price: 3.00, category: "Costillas" },

    // ACOMPAÑAMIENTOS
    { id: 12, name: "Torrejitas de maíz", description: "Cada una", price: 0.75, category: "Acompañamientos" },
    { id: 13, name: "Yuca frita", description: "La orden", price: 1.50, category: "Acompañamientos" },
    { id: 14, name: "Bollos de mantequilla", description: "Cada uno", price: 1.00, category: "Acompañamientos" },
    { id: 15, name: "Patacones", description: "La orden", price: 1.00, category: "Acompañamientos" },
    { id: 16, name: "Papas fritas", description: "La orden", price: 2.00, category: "Acompañamientos" },

    // BEBIDAS
    { id: 17, name: "Sodas", description: "", price: 1.50, category: "Bebidas" },
    { id: 18, name: "Agua", description: "", price: 1.00, category: "Bebidas" },
    { id: 19, name: "Chichas naturales", description: "(en botella) Limonada, maracuyá", price: 1.25, category: "Bebidas" },
    { id: 20, name: "Limonada hierbabuena", description: "Artesanal", price: 3.00, category: "Bebidas" },
    { id: 21, name: "Piña con hierbabuena", description: "Artesanal", price: 3.25, category: "Bebidas" },
];

// Renders product buttons into the designated grid
function renderProducts() {
    domNodes.productsGrid.innerHTML = '';

    // Agrupar productos por categoría en el orden original
    let currentCategory = '';

    PRODUCTS.forEach(product => {
        // Crear título de categoría si es nueva
        if (product.category !== currentCategory) {
            currentCategory = product.category;
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `<h3>${currentCategory}</h3>`;
            domNodes.productsGrid.appendChild(categoryHeader);
        }

        const btn = document.createElement('div');
        btn.className = 'product-btn';

        let descHTML = product.description ? `<span class="product-desc">${product.description}</span>` : '';

        btn.innerHTML = `
            <span class="product-name">${product.name}</span>
            ${descHTML}
            <span class="product-price">$${product.price.toFixed(2)}</span>
        `;
        // addToOrder comes from order.js
        btn.addEventListener('click', () => addToOrder(product));
        domNodes.productsGrid.appendChild(btn);
    });
}
