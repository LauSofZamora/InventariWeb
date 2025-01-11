async function fetchSales() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/ventas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las ventas');
        }

        const data = await response.json();

        // Poblar la tabla de ventas
        const salesTableBody = document.querySelector('#salesTable tbody');
        salesTableBody.innerHTML = ''; // Limpiar tabla existente

        data.ventas.forEach(venta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.id_venta}</td>
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td>${new Date(venta.fecha).toLocaleDateString()}</td>
                <td>$${venta.total.toFixed(2)}</td>
            `;
            salesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al consultar ventas:', error);
        alert('Hubo un problema al consultar las ventas.');
    }
}

// Llamar a la función al cargar la página
window.onload = fetchSales;
