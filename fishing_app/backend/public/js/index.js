document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go-to-login').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('go-to-register').addEventListener('click', () => {
        window.location.href = 'register.html';
    });

    document.getElementById('go-to-catalog').addEventListener('click', () => {
        window.location.href = 'catalog.html';
    });

    // Función para marcar el botón activo
    function setActiveButton() {
        const currentPage = window.location.pathname;
        const buttons = document.querySelectorAll('#navigation button');
        
        buttons.forEach(button => {
            if (currentPage.includes(button.id.replace('go-to-', ''))) {
                button.classList.add('bg-fishing-blue');
                button.classList.remove('bg-fishing-purple');
            } else {
                button.classList.remove('bg-fishing-blue');
                if (button.id === 'go-to-register') {
                    button.classList.add('bg-fishing-purple');
                }
            }
        });
    }

    // Llamar a la función cuando se carga la página
    setActiveButton();
});