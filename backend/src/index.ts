import dotenv from 'dotenv';
import app from './app';
import {createDbConnection} from "./db";

dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

(async () => {
  await createDbConnection();

  app.listen(Number(port), host, () => {
    console.log(`Successfully running on ${host}:${port}`);
  });
})()
