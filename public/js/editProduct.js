// document.getElementById('editProductForm').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const idProducto = /* Aquí obtienes el id del producto a editar */;
//     const nombre = document.getElementById('editNombre').value;
//     const caracteristicas = document.getElementById('editCaracteristicas').value;
//     const precio = document.getElementById('editPrecio').value;
//     const cantidad = document.getElementById('editCantidad').value;
//     const imagen = document.getElementById('editImagen').value;

//     const token = localStorage.getItem('token');

//     fetch(`http://localhost:3000/api/products/${idProducto}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//             nombre,
//             caracteristicas,
//             precio,
//             cantidad,
//             imagen
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert(data.message);
//         //redirigir o actualizar la vista aquí
//     })
//     .catch(error => console.error('Error:', error));
// });
