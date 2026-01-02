import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5051;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`HTTPS: Configured for production with SSL/TLS`);
    console.log(`Allowed CORS origins: ${process.env.ALLOWED_ORIGINS || 'https://estaraht.com, https://www.estaraht.com'}`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
