document.addEventListener('DOMContentLoaded', () => {
    const captureForm = document.getElementById('capture-form');
    const captureList = document.getElementById('capture-list');
    let token = localStorage.getItem('token');

    captureForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre_pez', document.getElementById('capture-nombre_pez').value);
        formData.append('tamano', document.getElementById('capture-tamano').value);
        formData.append('peso', document.getElementById('capture-peso').value);
        formData.append('fecha', document.getElementById('capture-fecha').value);
        formData.append('hora', document.getElementById('capture-hora').value);
        formData.append('lugar', document.getElementById('capture-lugar').value);
        const foto = document.getElementById('capture-foto').files[0];
        if (foto) {
            formData.append('foto', foto);
        }

        try {
            const res = await fetch('/catches', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert('Captura registrada con éxito');
                getCaptures();
            } else {
                alert(data.error || 'Error al registrar captura');
            }
        } catch (error) {
            console.error('Error al registrar captura:', error.message);
            alert('Ocurrió un error al registrar la captura. Revisa la consola para más detalles.');
        }
    });

    async function getCaptures() {
        try {
            const res = await fetch('/catches', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                captureList.innerHTML = '';
                data.forEach(capture => {
                    const li = document.createElement('li');
                    li.id = `capture-${capture.id}`;
                    li.innerHTML = `
                        
                      <span><img src="${capture.foto_url}" ------ alt="${capture.nombre_pez}" width="200px" height="200px"><span>
                        <span>${capture.nombre_pez} ------ ${capture.tamano}cm ------- ${capture.peso}kg ------- ${capture.lugar}</span>
                        <button class="delete-button" data-capture-id="${capture.id}">Eliminar</button><br>
                            --------------------------------------------------------------                        `;
                    captureList.appendChild(li);
                });
                addDeleteEventListeners(); // Añadir event listeners a los botones de eliminar
            } else {
                alert(data.error || 'Error al obtener capturas');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    function addDeleteEventListeners() {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async () => {
                const captureId = button.getAttribute('data-capture-id');
                try {
                    const res = await fetch(`/catches/${captureId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        alert('Captura eliminada con éxito');
                        getCaptures(); // Actualizar la lista de capturas
                    } else {
                        const data = await res.json();
                        throw new Error(data.error || 'Error al eliminar la captura');
                    }
                } catch (error) {
                    console.error('Error al eliminar captura:', error.message);
                    alert('No se pudo eliminar la captura');
                }
            });
        });
    }

    getCaptures(); // Cargar capturas al iniciar
});
