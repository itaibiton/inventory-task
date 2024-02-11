import { DataSource } from "typeorm";
import { Product } from "./entity/Product"; // Adjust the path as necessary

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [
        Product
    ],
    synchronize: true,
    logging: false,
})
