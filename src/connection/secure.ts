import dotenv from 'dotenv';
dotenv.config();

export const database = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

export const api = {
    hostname: process.env.API_HOST,
    path: process.env.API_URL,
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
};

export const app = {
    sqlQuery:
        'SELECT posicionId, vehiculoId,velocidad,satelites,rumbo,latitud,longitud,altitud,gpsDateTime,statusCode,ignition,odometro,horometro,nivelBateria,estado FROM `DriveTech` WHERE `estado` = "Nuevo" limit 50',
    sqlUpdate: 'UPDATE `DriveTech` SET `estado` = "Enviado" WHERE `posicionId`',
};
