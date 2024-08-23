document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const toast = document.getElementById("toast-simple");
    const toastMessage = document.getElementById("toast-message");
  
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("register-nombre").value;
      const correo = document.getElementById("email").value;
      const contraseña = document.getElementById("register-contraseña").value;
      const confirmarContraseña = document.getElementById("register-confirmar-contraseña").value;
  
      if (contraseña !== confirmarContraseña) {
        mostrarNotificacion("Las contraseñas no coinciden", "error");
        return;
      }
  
      try {
        const res = await fetch("/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, contraseña }),
        });
  
        const data = await res.json();
        if (res.ok) {
          mostrarNotificacion("Te has registrado correctamente", "success");
          setTimeout(() => {
            window.location.href = "login.html"; // Redirige al login después del registro
          }, 2000);
        } else {
          mostrarNotificacion(data.error || "Error al registrar usuario", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        mostrarNotificacion("Hubo un error en la solicitud", "error");
      }
    });
  
    document.getElementById("back-to-home").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  
    function mostrarNotificacion(mensaje, tipo) {
      toastMessage.textContent = mensaje;
  
      if (tipo === "success") {
        toast.classList.remove("bg-red-600");
        toast.classList.add("bg-green-600");
        toast.querySelector("svg").setAttribute("d", "M9 17l8-8-5-5-3 3-8-8");
      } else if (tipo === "error") {
        toast.classList.remove("bg-green-600");
        toast.classList.add("bg-red-600");
        toast.querySelector("svg").setAttribute("d", "M6 6l12 12M18 6L6 18");
      }
  
      toast.classList.remove("hidden");
  
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000); // Oculta la notificación después de 3 segundos
    }
  });
  