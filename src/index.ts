require("reflect-metadata"); // Must remain require at the very top

// express
import express from "express";
const app = express();

// helmet
import helmet from "helmet";
app.use(helmet());


// setup logger
import morgan from "morgan";
// Custom logging format.
const loggingFormat = ":date[iso] - :method - :url - :status - :response-time ms - :total-time ms - :res[content-length]";
app.use(morgan(loggingFormat, {
    skip: (req) => {
        return req.method === 'OPTIONS' || process.env.NODE_ENV == "test";
    }}));


// // body parser
// import bodyparser from "body-parser";
// app.use(bodyparser.json());

// TODO: cors
const cors = require('cors')
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.use(cors());  

let corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST', 'DELETE']
}
app.use(cors(corsOptions))
app.use(express.json())

// routes
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
