import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descripcion: string; // ⚠️ IMPORTANTE: Debe llamarse 'descripcion', no 'nombre'

  @Column()
  estado: string;
}