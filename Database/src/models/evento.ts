import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
//import { Admin } from "./Admin";

@Table({ tableName: "evento", timestamps: false })
export class Evento extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idEvento!: number;

    // @ForeignKey(() => Admin)
    // @Column(DataType.INTEGER)
    // idAdmin!: number;

    // @Column({
    //     type: DataType.DATE,
    //     allowNull: false
    // })
    // fechaEvento!: Date;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    descripcion!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    nombre!: string;

    // @BelongsTo(() => Admin)
    // admin!: Admin;
}