document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const productData = {
        nombre: formData.get('nombre'),
        caracteristicas: formData.get('caracteristicas'),
        precio: formData.get('precio'),
        cantidad: formData.get('cantidad'),
        imagen: formData.get('imagen')
    };

    const token = localStorage.getItem('token'); 
});

// Mostrar productos en la lista
function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
            <h3>${product.nombre}</h3>
            <p>Características: ${product.caracteristicas || 'N/A'}</p>
            <p>Precio: $${product.precio}</p>
            <p>Cantidad: ${product.cantidad}</p>
        `;
        productList.appendChild(productElement);
    });
}

// Registrar producto y actualizar lista
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const productData = {
        nombre: formData.get('nombre'),
        caracteristicas: formData.get('caracteristicas'),
        precio: formData.get('precio'),
        cantidad: formData.get('cantidad'),
        imagen: formData.get('imagen')
    };

    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/products/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message);
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Producto registrado exitosamente.');
        document.getElementById("productForm").reset();
        getProducts(); // Actualizar lista de productos
    })
    .catch(error => {
        alert(`Error al registrar producto: ${error.message}`);
        console.error('Error al registrar producto:', error);
    });
});

// Cargar productos al cargar la página
getProducts();

// Obtener productos y mostrarlos en la página
async function getProducts() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }

        const data = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = ''; 

        data.productos.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');

            // Ajustar el precio para no mostrar decimales
            const precioSinDecimales = Math.floor(product.precio);

            productElement.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.caracteristicas || 'N/A'}</p>
                <p>Precio: $${precioSinDecimales}</p>
                <p>Cantidad: ${product.cantidad}</p>
                <p>${product.archivado ? 'Archivado' : 'Activo'}</p>
                <button onclick="showEditForm(${product.id_producto})">Editar</button>
                <button onclick="confirmArchive(${product.id_producto}, ${product.archivado})">
                    ${product.archivado ? 'Desarchivar' : 'Archivar'}
                </button>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Mostrar el formulario de edición con los datos del producto
async function showEditForm(productId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del producto.');
        }

        const product = await response.json();

        // Ajustar el precio para no mostrar decimales
        const precioSinDecimales = Math.floor(product.precio);

        // Llenar el formulario con los datos del producto
        document.getElementById('editNombre').value = product.nombre;
        document.getElementById('editCaracteristicas').value = product.caracteristicas;
        document.getElementById('editPrecio').value = precioSinDecimales;
        document.getElementById('editCantidad').value = product.cantidad;
        document.getElementById('editImagen').value = product.imagen;

        const editForm = document.getElementById('editForm');
        editForm.dataset.productId = productId;

        // Mostrar el modal
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        alert(`Error al obtener los datos del producto: ${error.message}`);
        console.error('Error al obtener los datos del producto:', error);
    }
}

// Cerrar el modal al hacer clic en el botón de cierre
document.getElementById('closeModal').onclick = function () {
    document.getElementById('editModal').style.display = 'none';
};

// Cerrar el modal al hacer clic fuera del contenido
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Manejar la edición del producto
async function editProduct(event) {
    event.preventDefault();

    const productId = document.getElementById('editForm').dataset.productId;
    const formData = new FormData(event.target);

    const productData = {
        nombre: formData.get('nombre'),
        caracteristicas: formData.get('caracteristicas'),
        precio: formData.get('precio'),
        cantidad: formData.get('cantidad'),
        imagen: formData.get('imagen')
    };

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert('Producto actualizado exitosamente.');
        document.getElementById('editModal').style.display = 'none'; // Cerrar el modal
        getProducts(); // Actualizar la lista de productos
    } catch (error) {
        alert(`Error al actualizar el producto: ${error.message}`);
        console.error('Error al actualizar el producto:', error);
    }
}

// Archivar producto
function confirmArchive(productId, isArchived) {
    const modal = document.getElementById('archiveModal');
    const message = document.getElementById('archiveMessage');
    const confirmButton = document.getElementById('confirmArchiveButton');

    message.textContent = `¿Estás seguro de que deseas ${isArchived ? 'desarchivar' : 'archivar'} este producto?`;
    modal.style.display = 'block';

    confirmButton.onclick = async function () {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/products/${productId}/archivar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ archivado: !isArchived })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            alert(`Producto ${isArchived ? 'desarchivado' : 'archivado'} exitosamente.`);
            modal.style.display = 'none';
            getProducts();
        } catch (error) {
            alert(`Error al ${isArchived ? 'desarchivar' : 'archivar'} el producto: ${error.message}`);
            console.error(error);
        }
    };

    document.getElementById('cancelArchiveButton').onclick = function () {
        modal.style.display = 'none';
    };

    document.getElementById('closeArchiveModal').onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
