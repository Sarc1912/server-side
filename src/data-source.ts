import "reflect-metadata"
import { DataSource } from "typeorm"

import { env } from "../utils/env"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: env.NODE_ENV === 'development',
    logging: env.NODE_ENV === 'development',
    entities: [__dirname + "/entities/*.{js,ts}"],
    migrations: [],
    subscribers: [],
})
