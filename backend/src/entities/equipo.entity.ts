import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { Prestamo } from './prestamo.entity';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 CAMBIO AQUÍ: Añadimos { type: 'text' } para que quepan textos largos
  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  estado: string;

  @OneToMany(() => Incidencia, (incidencia) => incidencia.equipo)
  incidencias: Incidencia[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.equipo)
  prestamos: Prestamo[];
}