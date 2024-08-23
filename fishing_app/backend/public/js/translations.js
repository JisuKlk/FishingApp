const translations = {
    en: {
        login: "Log In",
        register: "Sign Up",
        developers: "Developers",
        captures: "Captures",
        fishName: "Fish Name",
        size: "Size (cm)",
        weight: "Weight (kg)",
        date: "Date",
        time: "Time",
        place: "Place",
        photo: "Photo",
        registerCapture: "Register Capture",
        viewMyCaptures: "View My Captures",
        name: "Name",
        namePlaceholder: "Enter your name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm your password",
        passwordMismatch: "Passwords do not match",
        backToHome: "Back to Home",
        registrationSuccess: "You have successfully registered",
        forgotPassword: "Forgot password?",
        noAccount: "Don't have an account?",
        signUp: "Sign up"
    },
    es: {
        login: "Iniciar Sesión",
        register: "Registrarse",
        developers: "Desarrolladores",
        captures: "Capturas",
        fishName: "Nombre del Pez",
        size: "Tamaño (cm)",
        weight: "Peso (kg)",
        date: "Fecha",
        time: "Hora",
        place: "Lugar",
        photo: "Foto",
        registerCapture: "Registrar Captura",
        viewMyCaptures: "Ver Mis Capturas",
        name: "Nombre",
        namePlaceholder: "Ingrese su nombre",
        email: "Correo electrónico",
        emailPlaceholder: "Ingrese su correo electrónico",
        password: "Contraseña",
        passwordPlaceholder: "Ingrese su contraseña",
        confirmPassword: "Confirmar Contraseña",
        confirmPasswordPlaceholder: "Confirme su contraseña",
        passwordMismatch: "Las contraseñas no coinciden",
        backToHome: "Volver al Inicio",
        registrationSuccess: "Te has registrado correctamente",
        forgotPassword: "¿Olvidó su contraseña?",
        noAccount: "¿No tiene una cuenta?",
        signUp: "Registrarse"
    }
};

function translatePage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

function updateLanguageButton(lang) {
    const flagIcon = document.getElementById('flag-icon');
    const languageText = document.getElementById('language-text');
    
    if (flagIcon && languageText) {
        if (lang === 'en') {
            flagIcon.src = "src/en-flag.png";
            flagIcon.alt = "English Flag";
            languageText.textContent = "EN";
        } else {
            flagIcon.src = "src/es-flag.png";
            flagIcon.alt = "Spanish Flag";
            languageText.textContent = "ES";
        }
    }
}

function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = localStorage.getItem('language') || 'es';
            const newLang = currentLang === 'es' ? 'en' : 'es';
            
            localStorage.setItem('language', newLang);
            translatePage(newLang);
            updateLanguageButton(newLang);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupLanguageToggle();
    
    // Obtener el idioma almacenado o usar español por defecto
    const storedLanguage = localStorage.getItem('language') || 'es';
    translatePage(storedLanguage);
    
    // Actualizar el botón de idioma
    updateLanguageButton(storedLanguage);
});