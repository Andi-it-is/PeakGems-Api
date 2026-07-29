import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
// Load .env file from the root directory
dotenv.config();

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    migrationsRun: true,
    // Use glob patterns to find files
    entities: [
        __dirname + "/entity/*.{js,ts}"
    ],
    migrations: [
        __dirname + "/migration/*.{js,ts}"
    ],
    subscribers: [
        __dirname + "/subscribers/*.{js,ts}"
    ],
})
