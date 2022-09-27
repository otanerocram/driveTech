import mysql2, { createPool } from 'mysql2';
import { database } from '../connection/secure';

export const pool = createPool(database);

export const connection = mysql2.createConnection(database);
