import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { Prestamo } from './prestamo.entity';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  n_ordenador?: number;

  @Column({ length: 255, nullable: true })
  n_serie?: string;

  @Column({ length: 255, nullable: true })
  situacion?: string;

  @Column({ length: 255, nullable: true })
  representante?: string;

  @Column({ length: 100, default: 'disponible' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ length: 100, nullable: true })
  f_prestamo?: string;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.equipo)
  incidencias: Incidencia[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.equipo)
  prestamos: Prestamo[];
}