// src/prestamos/dto/prestar-equipo.dto.ts
export class PrestarEquipoDto {
  representante: string;
  situacion: string;
  f_prestamo: Date;
  observaciones?: string;
}

// src/prestamos/dto/devolver-equipo.dto.ts
export class DevolverEquipoDto {
  f_devolucion: Date;
  observaciones_finales?: string;
}