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
import { EventoDiaSemana } from "./eventoDiaSemana";

@Table({ tableName: "promocionEventoDia", timestamps: false })
export class PromocionEventoDia extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idPromocionEventoDia!: number;

    @ForeignKey(() => Promocion)
    @Column(DataType.INTEGER)
    idPromocion!: number;

    @ForeignKey(() => EventoDiaSemana)
    @Column(DataType.INTEGER)
    idEventoDiaSemana!: number;

    @BelongsTo(() => Promocion)
    promocion!: Promocion;

    @BelongsTo(() => EventoDiaSemana)
    eventoDiaSemana!: EventoDiaSemana;
}