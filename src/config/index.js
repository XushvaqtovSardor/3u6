import { config } from './db.js';
import { connect } from 'mongoose';

const db_url = config.db.url;

export async function dbConnect() {
  try {
    await connect(db_url);
  } catch (err) {
    throw new Error(err);
  }
}
