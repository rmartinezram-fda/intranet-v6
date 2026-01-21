import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Equipo } from '../entities/equipo.entity';
import { Prestamo } from '../entities/prestamo.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
    private dataSource: DataSource,
  ) {}

  // ... (Tus métodos create, findAll, findOne, remove se mantienen igual)

  async findOne(id: number) {
    const equipo = await this.equipoRepository.findOne({ where: { id } });
    if (!equipo) throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    return equipo;
  }

  async update(id: number, datosEquipo: Partial<Equipo>) {
    await this.equipoRepository.update(id, datosEquipo);
    return this.findOne(id);
  }

  // --- NUEVAS FUNCIONES CORREGIDAS ---

  async prestar(id: number, datos: { representante: string; situacion: string; f_prestamo: Date | string; observaciones?: string }) {
    const equipo = await this.findOne(id);
    
    // Convertimos la fecha a ISO string para que coincida con tu tipo 'string' en la entidad
    const fechaISO = datos.f_prestamo instanceof Date ? datos.f_prestamo.toISOString().split('T')[0] : datos.f_prestamo;

    return this.update(id, {
      representante: datos.representante,
      situacion: datos.situacion,
      f_prestamo: fechaISO,
      estado: 'Prestado',
      observaciones: datos.observaciones
    });
  }

  async devolver(id: number, datos: { f_devolucion: Date | string; observaciones_finales?: string }) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const equipo = await this.findOne(id);

    // 1. Creamos el registro con los datos capturados
    const historico = this.dataSource.getRepository(Prestamo).create({
      equipo: equipo,
      representante: equipo.representante, // Guardamos quién lo tenía
      fecha_inicio: equipo.f_prestamo,
      fecha_devolucion: datos.f_devolucion,
      observaciones: datos.observaciones_finales || equipo.observaciones,
      finalizado: true
    });
    
    await queryRunner.manager.save(historico);

    // 2. Limpiamos la ficha del equipo para el siguiente uso
    await queryRunner.manager.update(Equipo, id, {
      estado: 'Disponible',
      representante: '', 
      f_prestamo: '', 
      situacion: 'Almacén',
      observaciones: '' // Opcional: limpiar también observaciones
    });

    await queryRunner.commitTransaction();
    return { message: 'Histórico generado con el representante legal' };
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
  // Métodos antiguos que ya tenías...
  findAll() {
    return this.equipoRepository.find({ order: { n_ordenador: 'ASC' } });
  }

  create(datosEquipo: any) {
    const nuevoEquipo = this.equipoRepository.create(datosEquipo);
    return this.equipoRepository.save(nuevoEquipo);
  }

  async remove(id: number) {
    const resultado = await this.equipoRepository.delete(id);
    if (resultado.affected === 0) throw new NotFoundException(`No se pudo eliminar el equipo ${id}`);
    return { message: 'Equipo eliminado correctamente' };
  }

  // src/equipos/equipos.service.ts

async getHistorico() {
  return await this.dataSource.getRepository(Prestamo).find({
    relations: ['equipo', 'alumno'], // Cargamos también al alumno
    order: { fecha_devolucion: 'DESC' } // Usamos el nombre real: fecha_devolucion
  });
}
}

  