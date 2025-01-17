async function loadProductsForFilter() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const productFilter = document.getElementById('productFilter');
        productFilter.innerHTML = '<option value="">Todos los productos</option>';

        data.productos.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id_producto;
            option.textContent = product.nombre;
            productFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar productos para filtro:', error);
    }
}

document.getElementById('reportForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData(this);

    const filters = {
        startDate: new Date(formData.get('startDate')).toISOString().split('T')[0],
        endDate: new Date(formData.get('endDate')).toISOString().split('T')[0],
        id_producto: formData.get('productFilter') || null
    };

    try {
        const response = await fetch('http://localhost:3000/api/ventas/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(filters)
        });

        const data = await response.json();

        // Poblar la tabla de reportes
        const reportTableBody = document.querySelector('#reportTable tbody');
        reportTableBody.innerHTML = '';

        if (data.ventas.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5">No se encontraron resultados para el rango de fechas y filtros seleccionados.</td>`;
            reportTableBody.appendChild(row);
        } else {
            data.ventas.forEach(venta => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${venta.producto}</td>
                    <td>${venta.cantidad}</td>
                    <td>${new Date(venta.fecha).toLocaleDateString()}</td>
                    <td>$${parseFloat(venta.precio).toFixed(0)}</td>
                    <td>$${parseFloat(venta.total).toFixed(0)}</td>
                `;
                reportTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Hubo un problema al generar el reporte.');
    }
});

// Cargar los productos para el filtro al cargar la página
window.onload = loadProductsForFilter;