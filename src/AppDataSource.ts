import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv";


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

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "postgres?!?",
//     database: "dev_foodreview",
//     synchronize: false,
//     logging: false,
//     migrationsRun: true,
//     // Use glob patterns to find files
//     entities: [
//         __dirname + "/entity/*.{js,ts}"
//     ],
//     migrations: [
//         __dirname + "/migration/*.{js,ts}"
//     ],
//     subscribers: [
//         __dirname + "/subscribers/*.{js,ts}"
//     ],
// })
