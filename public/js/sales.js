document.getElementById('salesForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const saleData = {
        id_producto: formData.get('id_producto'),
        cantidad: formData.get('cantidad'),
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/ventas/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(saleData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert(`Venta registrada exitosamente. Total: $${data.total}`);
        // Actualizar la lista de productos después de registrar la venta
        loadProducts();
    } catch (error) {
        alert(`Error al registrar venta: ${error.message}`);
        console.error('Error al registrar venta:', error);
    }
});

// Desplegable de productos 
async function loadProducts() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const productSelect = document.getElementById('id_producto');
        productSelect.innerHTML = ''; 

        data.productos.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id_producto;
            option.textContent = `${product.nombre} (Disponible: ${product.cantidad})`;
            productSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Consultar ventas
async function loadConsultProducts() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        const productFilter = document.getElementById('productFilter');
        productFilter.innerHTML = ''; 
        
        data.productos.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id_producto;
            option.textContent = product.nombre;
            productFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

async function fetchSales(filters = {}) {
    const token = localStorage.getItem('token');

    try {
        const url = new URL('http://localhost:3000/api/ventas');
        Object.keys(filters).forEach(key => {
            if (filters[key] !== null && filters[key] !== '') {
                url.searchParams.append(key, filters[key]);
            }
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las ventas');
        }

        const data = await response.json();

        const salesTableBody = document.querySelector('#salesTable tbody');
        salesTableBody.innerHTML = '';

        data.ventas.forEach(venta => {
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td>${new Date(venta.fecha).toLocaleDateString()}</td>
                <td>$${parseFloat(venta.precio).toFixed(0)}</td>
                <td>$${parseFloat(venta.total).toFixed(0)}</td>
            `;
            salesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al consultar ventas:', error);
        alert('Hubo un problema al consultar las ventas.');
    }
}

// Manejar el envío del formulario de filtros
document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const filters = {
        minQuantity: formData.get('minQuantity'),
        maxQuantity: formData.get('maxQuantity'),
        minTotal: formData.get('minTotal'),
        maxTotal: formData.get('maxTotal'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        products: Array.from(document.getElementById('productFilter').selectedOptions).map(option => option.value)
    };

    fetchSales(filters);
});

// Manejar el reset del formulario
document.getElementById('filterForm').addEventListener('reset', function() {
    setTimeout(() => fetchSales(), 0);
});

// Al cargar la página
window.onload = function() {
    loadProducts (); // Cargar la lista de productos disponibles
    loadConsultProducts(); // Cargar la lista de productos
    fetchSales(); // Cargar todas las ventas sin filtros
};
