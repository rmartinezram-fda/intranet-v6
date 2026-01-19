import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { Incidencia } from './incidencia.entity';

@Entity()
export class Alumno {
  @PrimaryGeneratedColumn()
  id_alumno: number;

  @Column({ nullable: true })
  gir: number; // Lo haremos nullable por si creas alumnos antes de tener el GIR

  @Column()
  nombre: string;

  @Column()
  apellido1: string;

  @Column({ nullable: true })
  apellido2: string;

  @Column({ unique: true }) // Importante para el login de Google
  email: string;

  @Column({ nullable: true })
  representante: string; // Nombre del padre/madre/tutor

  // Relación inversa: Un alumno puede tener muchos préstamos
  @OneToMany(() => Prestamo, (prestamo) => prestamo.alumno)
  prestamos: Prestamo[];

  @OneToMany(() => Incidencia, (incidencia) => incidencia.alumno)
  incidencias: Incidencia[];
}