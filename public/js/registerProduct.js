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
    productList.innerHTML = ''; // Limpiar la lista actual

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
        productList.innerHTML = ''; // Limpiar la lista actual

        data.productos.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-item');
            productElement.innerHTML = `
                <h3>${product.nombre}</h3>
                <p>Características: ${product.caracteristicas || 'N/A'}</p>
                <p>Precio: $${product.precio}</p>
                <p>Cantidad: ${product.cantidad}</p>
                <button onclick="showEditForm(${product.id_producto})">Editar</button>
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

        // Llenar el formulario con los datos del producto
        document.getElementById('editNombre').value = product.nombre;
        document.getElementById('editCaracteristicas').value = product.caracteristicas;
        document.getElementById('editPrecio').value = product.precio;
        document.getElementById('editCantidad').value = product.cantidad;
        document.getElementById('editImagen').value = product.imagen;

        const editForm = document.getElementById('editForm');
        editForm.style.display = 'block';
        editForm.dataset.productId = productId;
    } catch (error) {
        alert(`Error al obtener los datos del producto: ${error.message}`);
        console.error('Error al obtener los datos del producto:', error);
    }
}

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
        document.getElementById('editForm').style.display = 'none'; // Ocultar el formulario
        getProducts(); // Actualizar la lista de productos
    } catch (error) {
        alert(`Error al actualizar el producto: ${error.message}`);
        console.error('Error al actualizar el producto:', error);
    }
}
