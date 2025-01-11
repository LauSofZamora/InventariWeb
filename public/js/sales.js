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
        productSelect.innerHTML = ''; // Limpiar las opciones actuales

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

// Cargar productos al iniciar la página
window.onload = loadProducts;
