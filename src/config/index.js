import { config } from './db.js';
import { connect } from 'mongoose';

const db_url = config.db.url;

export async function dbConnect() {
  try {
    await connect(db_url);
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw new Error(err);
  }
}
