import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

import { Alumno } from './entities/alumno.entity';
import { Equipo } from './entities/equipo.entity';
import { Profesor } from './entities/profesor.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Alumno) private alumnoRepo: Repository<Alumno>,
    @InjectRepository(Equipo) private equipoRepo: Repository<Equipo>,
    @InjectRepository(Profesor) private profesorRepo: Repository<Profesor>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Iniciando carga de datos (Seed)...');
    
    // 1. Cargamos Equipos
    await this.seedEquipos();
    
    // 2. Cargamos Profesores
    await this.seedProfesores();
    
    console.log('🏁 Carga de datos finalizada.');
  }

  // ---------------------------------------------------------
  // 1. FUNCIÓN PARA CARGAR EQUIPOS
  // ---------------------------------------------------------
  async seedEquipos() {
    try {
      await this.equipoRepo.clear();
    } catch (e) {
      console.log('⚠️ La tabla de equipos ya estaba vacía o no se pudo limpiar.');
    }

    console.log('📦 Leyendo Excel de INVENTARIO...');

    const rutaExcel = path.join(process.cwd(), '..', 'inventario.xlsx');

    if (!fs.existsSync(rutaExcel)) {
      console.error(`❌ ERROR: No encuentro el archivo: ${rutaExcel}`);
      return;
    }

    try {
      const workbook = XLSX.readFile(rutaExcel);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const datosRaw: any[] = XLSX.utils.sheet_to_json(sheet);

      console.log(`📄 Filas encontradas en Inventario: ${datosRaw.length}`);

      const equipos = datosRaw.map((fila) => {
        // Datos brutos
        const nOrdenador = fila['n_ordenador'] || 'Sin ID';
        const nSerie = fila['n_serie'] || '';
        const situacion = fila['situacion'] || 'disponible';
        const representante = fila['representante'] || '';
        const observaciones = fila['observaciones'] || '';

        // Construcción de descripción
        let descripcionCompleta = `PC: ${nOrdenador}`;
        if (nSerie) descripcionCompleta += ` | SN: ${nSerie}`;
        if (representante) descripcionCompleta += ` | Asignado: ${representante}`;
        if (observaciones) descripcionCompleta += ` (${observaciones})`;

        // Normalización de estado
        let estadoFinal = situacion.toString().toLowerCase().trim();
        if (!estadoFinal) estadoFinal = 'disponible';

        return {
          descripcion: descripcionCompleta,
          estado: estadoFinal
        };
      });

      // --- AQUÍ ESTABA EL ERROR ---
      // Añadimos "as any" para que TypeScript no se queje por tipos estrictos
      await this.equipoRepo.save(equipos as any);
      
      console.log(`✅ ¡INVENTARIO CARGADO! ${equipos.length} equipos guardados.`);

    } catch (error) {
      console.error('❌ Error cargando inventario:', error);
    }
  }

  // ---------------------------------------------------------
  // 2. FUNCIÓN PARA CARGAR PROFESORES
  // ---------------------------------------------------------
  async seedProfesores() {
    try {
      await this.profesorRepo.clear();
    } catch (e) {
      console.log('⚠️ La tabla de profesores ya estaba vacía.');
    }

    console.log('🌱 Leyendo Excel de PROFESORES...');

    const rutaExcel = path.join(process.cwd(), '..', 'correos_claustro.xlsx');

    if (!fs.existsSync(rutaExcel)) {
      console.error(`❌ ERROR: No encuentro el archivo: ${rutaExcel}`);
      return;
    }

    try {
      const workbook = XLSX.readFile(rutaExcel);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const datosRaw: any[] = XLSX.utils.sheet_to_json(sheet);

      console.log(`📄 Filas encontradas en Profesores: ${datosRaw.length}`);

      const mapaProfesores = new Map();

      datosRaw.forEach((fila) => {
        const nombre = fila['Nombre'] || fila['NOMBRE'] || fila['Apellidos y nombre'] || 'Docente';
        const emailRaw = fila['Correo'] || fila['Email'] || fila['CORREO'] || '';
        const email = emailRaw.toString().trim().toLowerCase();

        if (email.includes('@')) {
            mapaProfesores.set(email, {
                nombre: nombre,
                email: email,
                rol: 'profesor'
            });
        }
      });

      const profesoresUnicos = Array.from(mapaProfesores.values());

      // También usamos 'as any' aquí por si acaso
      await this.profesorRepo.save(profesoresUnicos as any);
      
      console.log(`✅ ¡PROFESORES CARGADOS! ${profesoresUnicos.length} docentes.`);

    } catch (error) {
      console.error('❌ Error cargando profesores:', error);
    }
  }

  async seedAlumnos() {}
}