import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import * as XLSX from 'xlsx';
import * as path from 'path';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
  ) {}

  // En backend/src/equipos/seed.service.ts

async onApplicationBootstrap() {
  const count = await this.equipoRepository.count();
  // Comentamos la siguiente línea temporalmente si quieres forzar la recarga:
  // if (count > 0) return; 

  try {
    const excelPath = path.join(process.cwd(), 'inventario.xlsx');
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const [header, ...rows] = rawData;
    console.log(`📊 Total filas detectadas en Excel: ${rows.length}`);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      // Relajamos la condición de salto: solo saltamos si la fila está totalmente vacía
      if (i % 20 === 0) {
    console.log(`⏳ Procesando fila ${i}...`);
  }

  if (!row || row.length < 2) continue; 

  try {
    const data: any = {
      n_ordenador: row[0] ? Number(row[0]) : undefined,
      n_serie: row[1] ? String(row[1]) : 'S/N',
      situacion: row[2] ? String(row[2]) : 'Sin ubicación',
      representante: row[3] ? String(row[3]) : '',
      estado: row[4] ? String(row[4]).toLowerCase() : 'disponible',
      observaciones: row[5] ? String(row[5]) : '',
      f_prestamo: row[6] ? String(row[6]) : '',
    };

    const nuevo = this.equipoRepository.create(data);
    await this.equipoRepository.save(nuevo);
  } catch (rowError) {
    // Si una fila falla, esto nos dirá EXACTAMENTE por qué
    console.error(`❌ Error REAL en fila ${i + 1} (Contenido: ${row[1]}):`, rowError.message);
  }
}
    console.log('✅ Proceso de carga finalizado');
  } catch (error) {
    console.error('❌ Error crítico en el Seed:', error.message);
  }
}
}