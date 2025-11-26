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
import { Evento } from "./evento";

@Table({ tableName: "eventoDiaSemana", timestamps: false })
export class EventoDiaSemana extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    idEventoSemana!: number;

    @Column({
        type: DataType.TIME,
        allowNull: false
    })
    horaFin!: string;

    @Column({
        type: DataType.TIME,
        allowNull: false
    })
    horaInicio!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fecha!: Date;

    @ForeignKey(() => Evento)
    @Column(DataType.INTEGER)
    idEvento!: number;

    // @Column({
    //     type: DataType.STRING(20),
    //     allowNull: false
    // })
    // diaSemana!: string;

    @BelongsTo(() => Evento)
    evento!: Evento;
}