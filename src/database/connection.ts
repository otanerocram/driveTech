import { createPool } from 'mysql2';
import { database } from '../connection/secure';

export const pool = createPool(database);
