import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Alumno } from './alumno.entity';
import { Equipo } from './equipo.entity';

@Entity()
export class Prestamo {
  @PrimaryGeneratedColumn()
  id_prestamo: number;

  @Column({ default: false })
  finalizado: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_inicio: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_devolucion: Date;

  // Relaciones (Foreign Keys)
  @ManyToOne(() => Alumno, (alumno) => alumno.prestamos)
  @JoinColumn({ name: 'id_alumno' }) // Esto crea la columna id_alumno en la BD
  alumno: Alumno;

  @ManyToOne(() => Equipo, (equipo) => equipo.prestamos)
  @JoinColumn({ name: 'id_equipo' })
  equipo: Equipo;
}