import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres?!?",
    database: "dev_foodreview",
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
