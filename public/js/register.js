document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault(); 

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password }),
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error('Error en el registro');
          }
          return response.json();
      })
      .then((data) => {
          console.log(data);
          alert('Registro exitoso');
          document.getElementById("registerForm").reset();

      })
      .catch((error) => {
          console.error('Error:', error);
          alert('Hubo un problema con el registro');
      });
});
