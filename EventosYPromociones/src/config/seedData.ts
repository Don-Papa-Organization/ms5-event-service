import {
  Evento,
  EventoDiaSemana,
  ProductoPromocion,
  Promocion,
  PromocionEventoDia,
} from "../domain/entities";

type PromocionSeed = {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipoPromocion: "porcentaje" | "precio_fijo";
  activo: boolean;
};

type EventoSeed = {
  nombre: string;
  descripcion: string;
  dias: Array<{
    fecha: string;
    horaInicio: string;
    horaFin: string;
    promocionNombre: string;
  }>;
};

const PROMOCIONES_SEED: PromocionSeed[] = [
  {
    nombre: "Promo Noches Doradas",
    descripcion: "Descuento especial en seleccion de productos para noches de fin de semana.",
    fechaInicio: "2026-05-10T00:00:00.000Z",
    fechaFin: "2026-07-31T23:59:59.000Z",
    tipoPromocion: "porcentaje",
    activo: true,
  },
  {
    nombre: "Promo Ronda Premium",
    descripcion: "Precio fijo en referencias premium para grupos y celebraciones.",
    fechaInicio: "2026-05-15T00:00:00.000Z",
    fechaFin: "2026-08-15T23:59:59.000Z",
    tipoPromocion: "precio_fijo",
    activo: true,
  },
  {
    nombre: "Promo Jueves Fiesta",
    descripcion: "Beneficio por volumen para activar el consumo de jueves.",
    fechaInicio: "2026-06-01T00:00:00.000Z",
    fechaFin: "2026-09-01T23:59:59.000Z",
    tipoPromocion: "porcentaje",
    activo: true,
  },
  {
    nombre: "Promo Weekend Mix",
    descripcion: "Paquete de fin de semana con precios promocionales en combinaciones populares.",
    fechaInicio: "2026-06-10T00:00:00.000Z",
    fechaFin: "2026-09-30T23:59:59.000Z",
    tipoPromocion: "precio_fijo",
    activo: true,
  },
  {
    nombre: "Promo Happy Sunset",
    descripcion: "Descuento para horario tarde noche en productos de alta rotacion.",
    fechaInicio: "2026-07-01T00:00:00.000Z",
    fechaFin: "2026-10-15T23:59:59.000Z",
    tipoPromocion: "porcentaje",
    activo: true,
  },
];

const EVENTOS_SEED: EventoSeed[] = [
  {
    nombre: "Noche de Cocteles",
    descripcion: "Evento tematico con ambientacion especial y promociones dirigidas.",
    dias: [
      {
        fecha: "2026-05-22T00:00:00.000Z",
        horaInicio: "19:00:00",
        horaFin: "23:00:00",
        promocionNombre: "Promo Noches Doradas",
      },
      {
        fecha: "2026-05-29T00:00:00.000Z",
        horaInicio: "19:30:00",
        horaFin: "23:30:00",
        promocionNombre: "Promo Ronda Premium",
      },
    ],
  },
  {
    nombre: "Sabado de DJ",
    descripcion: "Jornada musical con alta afluencia y plan de promociones por horario.",
    dias: [
      {
        fecha: "2026-06-13T00:00:00.000Z",
        horaInicio: "20:00:00",
        horaFin: "23:59:00",
        promocionNombre: "Promo Jueves Fiesta",
      },
      {
        fecha: "2026-06-20T00:00:00.000Z",
        horaInicio: "20:00:00",
        horaFin: "23:59:00",
        promocionNombre: "Promo Weekend Mix",
      },
    ],
  },
  {
    nombre: "Tarde de Celebracion",
    descripcion: "Evento social para reservas grupales con beneficios escalonados.",
    dias: [
      {
        fecha: "2026-07-11T00:00:00.000Z",
        horaInicio: "18:00:00",
        horaFin: "22:00:00",
        promocionNombre: "Promo Happy Sunset",
      },
      {
        fecha: "2026-07-18T00:00:00.000Z",
        horaInicio: "18:30:00",
        horaFin: "22:30:00",
        promocionNombre: "Promo Noches Doradas",
      },
    ],
  },
];

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getProductoPayload(promocionId: number, productoId: number, pairIndex: number) {
  const cantidadMinima = 1 + (pairIndex % 3);
  const descuentoBase = 8 + pairIndex * 4;

  return {
    idPromocion: promocionId,
    idProducto: productoId,
    cantidadMinima,
    porcentajeDescuento: descuentoBase,
    precioPromocional: null as number | null,
  };
}

export async function runEventosPromocionesSeed(): Promise<void> {
  let promocionesCreadas = 0;
  let promocionesExistentes = 0;
  let productosPromocionCreados = 0;
  let productosPromocionExistentes = 0;
  let eventosCreados = 0;
  let eventosExistentes = 0;
  let diasEventoCreados = 0;
  let diasEventoExistentes = 0;
  let enlacesPromoDiaCreados = 0;
  let enlacesPromoDiaExistentes = 0;

  const promocionesByNombre = new Map<string, Promocion>();

  for (let i = 0; i < PROMOCIONES_SEED.length; i++) {
    const plan = PROMOCIONES_SEED[i];
    const nombre = normalize(plan.nombre);

    const existente = await Promocion.findOne({ where: { nombre } });
    if (existente) {
      promocionesExistentes++;
      promocionesByNombre.set(nombre, existente);
    } else {
      const nueva = await Promocion.create({
        nombre,
        descripcion: plan.descripcion,
        fechaInicio: new Date(plan.fechaInicio),
        fechaFin: new Date(plan.fechaFin),
        tipoPromocion: plan.tipoPromocion,
        activo: plan.activo,
      } as any);
      promocionesCreadas++;
      promocionesByNombre.set(nombre, nueva);
    }

    const promocionActual = promocionesByNombre.get(nombre)!;

    // Asociacion de 2 productos por promocion con IDs consecutivos: (1,2), (3,4), ...
    const productoInicio = i * 2 + 1;
    const productoIds = [productoInicio, productoInicio + 1];

    for (let j = 0; j < productoIds.length; j++) {
      const idProducto = productoIds[j];

      const relacionExistente = await ProductoPromocion.findOne({
        where: {
          idPromocion: promocionActual.idPromocion,
          idProducto,
        },
      });

      if (relacionExistente) {
        productosPromocionExistentes++;
        continue;
      }

      await ProductoPromocion.create(getProductoPayload(promocionActual.idPromocion, idProducto, j) as any);
      productosPromocionCreados++;
    }
  }

  for (const eventoPlan of EVENTOS_SEED) {
    const nombreEvento = normalize(eventoPlan.nombre);

    let evento = await Evento.findOne({ where: { nombre: nombreEvento } });
    if (evento) {
      eventosExistentes++;
    } else {
      evento = await Evento.create({
        nombre: nombreEvento,
        descripcion: eventoPlan.descripcion,
      } as any);
      eventosCreados++;
    }

    for (const diaPlan of eventoPlan.dias) {
      const fecha = new Date(diaPlan.fecha);

      let eventoDia = await EventoDiaSemana.findOne({
        where: {
          idEvento: evento.idEvento,
          fecha,
          horaInicio: diaPlan.horaInicio,
          horaFin: diaPlan.horaFin,
        },
      });

      if (eventoDia) {
        diasEventoExistentes++;
      } else {
        eventoDia = await EventoDiaSemana.create({
          idEvento: evento.idEvento,
          fecha,
          horaInicio: diaPlan.horaInicio,
          horaFin: diaPlan.horaFin,
        } as any);
        diasEventoCreados++;
      }

      const promocionAsociar = promocionesByNombre.get(normalize(diaPlan.promocionNombre));
      if (!promocionAsociar) {
        console.warn(`[SEED] Promocion no encontrada para asociar a evento-dia: ${diaPlan.promocionNombre}`);
        continue;
      }

      const enlaceExistente = await PromocionEventoDia.findOne({
        where: {
          idPromocion: promocionAsociar.idPromocion,
          idEventoDiaSemana: eventoDia.idEventoSemana,
        },
      });

      if (enlaceExistente) {
        enlacesPromoDiaExistentes++;
        continue;
      }

      await PromocionEventoDia.create({
        idPromocion: promocionAsociar.idPromocion,
        idEventoDiaSemana: eventoDia.idEventoSemana,
      } as any);
      enlacesPromoDiaCreados++;
    }
  }

  console.log(
    "[SEED][EVENTOS-PROMOCIONES] " +
      `Promociones creadas: ${promocionesCreadas}, existentes: ${promocionesExistentes}. ` +
      `ProductoPromocion creadas: ${productosPromocionCreados}, existentes: ${productosPromocionExistentes}. ` +
      `Eventos creados: ${eventosCreados}, existentes: ${eventosExistentes}. ` +
      `EventoDiaSemana creados: ${diasEventoCreados}, existentes: ${diasEventoExistentes}. ` +
      `PromocionEventoDia creadas: ${enlacesPromoDiaCreados}, existentes: ${enlacesPromoDiaExistentes}.`
  );
}
