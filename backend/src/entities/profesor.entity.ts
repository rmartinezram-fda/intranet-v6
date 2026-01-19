import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El email no se puede repetir
  email: string;

  @Column()
  nombre: string;

  @Column({ default: 'profesor' }) // Por si quieres tener 'admin' en el futuro
  rol: string;
}