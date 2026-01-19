import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importante
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
import { Equipo } from '../entities/equipo.entity'; // <--- Importamos TU entidad

@Module({
  imports: [TypeOrmModule.forFeature([Equipo])], // <--- Registramos la tabla
  controllers: [EquiposController],
  providers: [EquiposService],
})
export class EquiposModule {}