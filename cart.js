// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Añadir producto al carrito
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${name} añadido al carrito`);
}

// Remover producto del carrito
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

// Actualizar cantidad de producto
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartModal();
        }
    }
}

// Vaciar carrito
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification('Carrito vaciado');
}

// Abrir modal del carrito
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'block';
        updateCartModal();
    }
}

// Cerrar modal del carrito
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Actualizar contenido del modal del carrito
function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Tu carrito está vacío</p>';
        cartTotal.textContent = '0€';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}€ x ${item.quantity} = ${itemTotal}€</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="margin: 0 0.5rem; font-weight: bold;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${total}€`;
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Gracias por tu compra!\nTotal: ${total}€\n\nEn una implementación real, aquí se procesaría el pago.`);
    
    clearCart();
    closeCartModal();
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCartModal();
    }
}

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});