import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesor } from './entities/profesor.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(Profesor) private profesorRepo: Repository<Profesor>,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; name: string; picture: string }) {
    // Limpiamos el email que viene de Google
    const emailGoogle = body.email.trim().toLowerCase();
    
    console.log(`🔍 INTENTO DE LOGIN:`);
    console.log(`   - Email de Google: '${emailGoogle}'`);

    // Buscamos
    const profesor = await this.profesorRepo.findOneBy({ email: emailGoogle });

    if (!profesor) {
      console.log(`   ⛔ FALLO: El email '${emailGoogle}' NO existe en la base de datos.`);
      console.log(`      (Consejo: Revisa si en la BD se guardó diferente)`);
      throw new UnauthorizedException('No estás en la lista de profesores autorizados.');
    }

    console.log(`   ✅ ÉXITO: Usuario encontrado: ${profesor.nombre}`);
    
    return {
      autorizado: true,
      rol: profesor.rol,
      usuario: {
        nombre: profesor.nombre,
        email: profesor.email,
        foto: body.picture
      }
    };
  }
}