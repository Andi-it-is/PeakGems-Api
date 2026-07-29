require("reflect-metadata"); // Must remain require at the very top

// .env muss vor jedem process.env-Zugriff geladen sein (z.B. bevor CORS/JWT-Config unten gelesen wird)
import * as dotenv from "dotenv";
dotenv.config();

// Fail fast: fehlende/leere Pflicht-Umgebungsvariablen sollen den Start verhindern,
// statt später mit z.B. offenem CORS (*) oder undefined JWT-Secret unbemerkt zu laufen.
import * as Joi from "joi";
const envSchema = Joi.object({
    DB_TYPE: Joi.string().valid('postgres', 'mysql').required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_ACCESSTOKEN_SECRET: Joi.string().min(32).required(),
    CORS_ORIGIN: Joi.string().required(),
}).unknown(true);

const { error: envError } = envSchema.validate(process.env);
if (envError) {
    throw new Error(`Fehlende/ungültige Umgebungsvariablen: ${envError.message}`);
}

// express
import express from "express";
const app = express();

// Läuft bei netcup hinter Apache/Nginx als Reverse-Proxy - genau ein Hop wird vertraut, damit
// req.ip / X-Forwarded-For die echte Client-IP liefern (relevant fürs Rate-Limiting unten).
app.set('trust proxy', 1);

// helmet
import helmet from "helmet";
app.use(helmet());

// rate limiting - allgemeines Limit für alle Routen, striktere Limits siehe auth/router.ts
import { generalLimiter } from "./lib/middleware/rateLimiters";
app.use(generalLimiter);


// setup logger
import morgan from "morgan";
// Custom logging format.
const loggingFormat = ":date[iso] - :method - :url - :status - :response-time ms - :total-time ms - :res[content-length]";
app.use(morgan(loggingFormat, {
    skip: (req) => {
        return req.method === 'OPTIONS' || process.env.NODE_ENV == "test";
    }
}));


// // body parser
// import bodyparser from "body-parser";
// app.use(bodyparser.json());

const cors = require('cors')

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Needed if you are using cookies/sessions
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

// routes
// Avatare/Location-Bilder werden nicht mehr öffentlich per express.static ausgeliefert, sondern
// über authentifizierte Routen direkt im user-/location-Router: GET /api/v1/user/avatar/:filename,
// GET /api/v1/location/images/:filename.
import versionRouter from "./api/versionRouter";
app.use(versionRouter);

import { AppDataSource } from "./AppDataSource";
const PORT: string = process.env.PORT || "3000";
app.listen(PORT, async () => {

    console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

    await connectToDb();
    console.log(`Backend started. Listening on port: ${PORT}`);
});


// Use the DataSource to initilize connection and run the Migrations
const connectToDb = async (): Promise<any> => {

    for (let counter = 0; counter < 5; counter++) {

        try {

            await AppDataSource.initialize();
            break;
        } catch (error) {

            if (counter == 4) {
                throw error;
            }
            console.log("could not connect to db - retry in 3 sec (" + (counter + 1) + "/5)");
            await delay(3);
        }

    }
    console.log("Connection to DB successfull - runnning migration");
    await AppDataSource.runMigrations();
    console.log("Runnning migration was successfull. Enjoy the Applications Backend");

    return;
};

const delay = (n) => new Promise(r => setTimeout(r, n * 1000));
