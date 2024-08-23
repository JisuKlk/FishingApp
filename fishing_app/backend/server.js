const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;



// Configurar base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fishing-api',
  password: 'Imthenumber1!',
  port: 5432,
});

// Configurar Multer para la carga de archivos
const upload = multer({
  dest: 'uploads/'});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

// Sirviendo el archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Registro de usuario
app.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  const hashedPassword = await bcrypt.hash(contraseña, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id',
      [nombre, correo, hashedPassword]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE correo = $1', [correo]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(contraseña, user.contraseña)) {
      const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


// Ruta para registrar una captura de pesca
app.post('/catches', upload.single('foto'), async (req, res) => {
  const { nombre_pez, tamano, peso, fecha, hora, lugar } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userId = decoded.userId;

    // Leer la imagen como un buffer binario si existe
    let fotoBuffer = null;
    if (req.file) {
      fotoBuffer = fs.readFileSync(req.file.path); // Lee la imagen como un buffer

      // Eliminar el archivo temporal después de leerlo
      fs.unlinkSync(req.file.path); // Borra el archivo temporal
    }

    // Insertar la captura en la base de datos
    await pool.query(
      'INSERT INTO catches (user_id, nombre_pez, tamano, peso, fecha, hora, lugar, foto_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [userId, nombre_pez, tamano, peso, fecha, hora, lugar,fotoBuffer]
    );

    res.status(201).json({ message: 'Captura registrada con éxito' });
  } catch (error) {
    console.error('Error al registrar captura:', error.message);
    res.status(500).json({ error: 'Error al registrar captura' });
  }
});




// Obtener capturas de pesca de un usuario
app.get('/catches', async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const userId = decoded.userId;

      const result = await pool.query('SELECT * FROM catches WHERE user_id = $1', [userId]);

      const catches = result.rows.map(capture => {
          if (capture.foto_url) {
              // Convertir el buffer binario a un string en base64
              const base64Image = capture.foto_url.toString('base64');
              // Crear el Data URI para imágenes
              capture.foto_url = `data:image/jpeg;base64,${base64Image}`;
          }
          return capture;
      });

      res.json(catches);
  } catch (error) {
      res.status(500).json({ error: 'Error al obtener capturas' });
  }
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});




// Eliminar una captura de pesca
app.delete('/catches/:id', async (req, res) => {
  try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const userId = decoded.userId;
      const captureId = req.params.id;

      // Verificar que la captura pertenece al usuario
      const result = await pool.query('DELETE FROM catches WHERE id = $1 AND user_id = $2', [captureId, userId]);

      if (result.rowCount > 0) {
          res.status(200).json({ message: 'Captura eliminada con éxito' });
      } else {
          res.status(404).json({ error: 'Captura no encontrada o no pertenece al usuario' });
      }
  } catch (error) {
      console.error('Error al eliminar captura:', error.message);
      res.status(500).json({ error: 'Error al eliminar captura' });
  }
});


app.get('/api/check-email', async (req, res) => {
  const { email } = req.query;

  try {
      // Consulta a la base de datos para comprobar si el correo ya existe
      const result = await pool.query('SELECT * FROM users WHERE correo = $1', [email]);

      if (result.rows.length > 0) {
          // El correo ya está registrado
          res.json({ exists: true });
      } else {
          // El correo no está registrado
          res.json({ exists: false });
      }
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al comprobar el correo electrónico' });
  }
});




