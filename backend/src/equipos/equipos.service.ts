import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from '../entities/equipo.entity'; 

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private equipoRepository: Repository<Equipo>,
  ) {}

  // 👇 FALTABA ESTE MÉTODO
  create(datosEquipo: any) {
    const nuevoEquipo = this.equipoRepository.create(datosEquipo);
    return this.equipoRepository.save(nuevoEquipo);
  }

  findAll() {
    return this.equipoRepository.find();
  }

  findOne(id: number) {
    return this.equipoRepository.findOne({ where: { id: id } });
  }

  // 👇 AÑADO ESTE POR SI ACASO LO PIDE EL CONTROLADOR TAMBIÉN
  update(id: number, datosEquipo: any) {
    return this.equipoRepository.update(id, datosEquipo);
  }

  async remove(id: number) {
    await this.equipoRepository.delete(id);
  }
}