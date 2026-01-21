import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EquiposService } from './equipos.service';
import { Equipo } from '../entities/equipo.entity';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  create(@Body() createEquipoDto: Partial<Equipo>) {
    return this.equiposService.create(createEquipoDto);
  }

  @Get()
  findAll() {
    return this.equiposService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipoDto: Partial<Equipo>) {
    return this.equiposService.update(+id, updateEquipoDto);
  }

  // Nuevo endpoint para prestar
  @Patch(':id/prestar')
  prestar(@Param('id') id: string, @Body() datos: any) {
    return this.equiposService.prestar(+id, datos);
  }

  // Nuevo endpoint para devolver
  @Patch(':id/devolver')
  devolver(@Param('id') id: string, @Body() datos: any) {
    return this.equiposService.devolver(+id, datos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equiposService.remove(+id);
  }

  @Get('historico')
  getHistorico() {
    return this.equiposService.getHistorico();
}
}