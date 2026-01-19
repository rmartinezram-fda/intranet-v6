import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipo } from './equipo.entity';
import { Alumno } from './alumno.entity';

@Entity()
export class Incidencia {
  @PrimaryGeneratedColumn()
  id_incidencia: number;

  @Column('text')
  descripcion: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  // Relación con Equipo (Obligatoria según tu diseño)
  @ManyToOne(() => Equipo, (equipo) => equipo.incidencias)
  @JoinColumn({ name: 'id_equipo' })
  equipo: Equipo;

  // Relación con Alumno (Quién reportó o rompió el equipo)
  @ManyToOne(() => Alumno, (alumno) => alumno.incidencias)
  @JoinColumn({ name: 'id_alumno' })
  alumno: Alumno;
}