// Funcionalidad de filtros de productos
function filterProducts(category) {
    const products = document.querySelectorAll('.producto');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Actualizar botones activos
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filtrar productos
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

// Funcionalidad de lista de deseos
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(id, name) {
    const index = wishlist.findIndex(item => item.id === id);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${name} eliminado de la lista de deseos`);
    } else {
        wishlist.push({ id, name });
        showNotification(`${name} añadido a la lista de deseos`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistButtons();
}

function updateWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        if (wishlist.some(item => item.id === productId)) {
            btn.style.backgroundColor = '#ef4444';
            btn.style.color = 'white';
        } else {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#ef4444';
        }
    });
}

// Animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
    
    .producto {
        animation: fadeIn 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Inicializar funcionalidades al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistButtons();
    
    // Añadir event listeners a botones de wishlist
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach((btn, index) => {
        btn.setAttribute('data-product-id', index + 1);
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const productName = this.closest('.producto').querySelector('h3').textContent;
            toggleWishlist(productId, productName);
        });
    });
});