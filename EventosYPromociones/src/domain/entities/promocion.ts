import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement
} from "sequelize-typescript";

@Table({ tableName: "promocion", timestamps: false })
export class Promocion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idPromocion!: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    nombre!: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    descripcion!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fechaInicio!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fechaFin!: Date;

    @Column({
        type: DataType.ENUM('porcentaje', 'precio_fijo', 'combo'),
        allowNull: false
    })
    tipoPromocion!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    activo!: boolean;
}