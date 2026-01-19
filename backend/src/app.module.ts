// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { AppService } from './app.service';
import { Alumno } from './entities/alumno.entity';
import { Equipo } from './entities/equipo.entity';
import { Prestamo } from './entities/prestamo.entity';
import { Incidencia } from './entities/incidencia.entity';
import { SeedService } from './seed.service'; // <--- IMPORTAR
import { EquiposModule } from './equipos/equipos.module';
import { Profesor } from './entities/profesor.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'sigfa_db_final', // <--- CAMBIO IMPORTANTE: El nombre nuevo
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    // Registramos las entidades para poder usarlas dentro del SeedService
    TypeOrmModule.forFeature([Alumno, Equipo, Prestamo, Incidencia, Profesor]),
    EquiposModule,
  ],
  controllers: [AppController, AuthController], // <--- 2. AÑÁDELO AQUÍ
  providers: [AppService, SeedService],
})
export class AppModule {}