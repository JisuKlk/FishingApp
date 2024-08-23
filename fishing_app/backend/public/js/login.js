document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token); // Guardar el token en localStorage
                window.location.href = 'capture.html'; // Redirige al panel de capturas
            } else {
                alert(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    document.getElementById('back-to-home').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
