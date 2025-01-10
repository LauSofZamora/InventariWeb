document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
  
    // Captura los datos del formulario
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
        // Realiza la solicitud al servidor
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
  
        // Maneja la respuesta del servidor
        const result = await response.json();
        alert(result.message);
  
        if (result.success) {
            // Si el inicio de sesión es exitoso, redirige o guarda el token
            localStorage.setItem("token", result.token);
            window.location.href = "/registerProduct.html"; 
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema con el inicio de sesión.");
    }
  });
  