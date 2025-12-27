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

@Table({ tableName: "evento", timestamps: false })
export class Evento extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idEvento!: number;

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
}