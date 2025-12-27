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
import { Promocion } from "./promocion";

@Table({ tableName: "productoPromocion", timestamps: false })
export class ProductoPromocion extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idProductoPromocion!: number;

    @Column({
        type: DataType.DECIMAL(10, 2)
    })
    precioPromocional?: number;

    @Column({
        type: DataType.DECIMAL(5, 2),
        defaultValue: 0.00
    })
    porcentajeDescuento?: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    cantidadMinima!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idProducto!: number;

    @ForeignKey(() => Promocion)
    @Column(DataType.INTEGER)
    idPromocion!: number;

    @BelongsTo(() => Promocion)
    promocion!: Promocion;
}