import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column("float")
    price!: number;

    // Use a JSON column for fully dynamic attributes
    @Column("json", { nullable: true })
    attributes?: Record<string, any>;
}
