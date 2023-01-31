import { join } from "path";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule } from "@nestjs/mongoose";
import { PokemonModule } from "./pokemon/pokemon.module";
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),

    // no funciona con localhost , pero funciona con 127.0.0.1 
    // 127.0.0.1 es literal lo mismo que localhost
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/nest-pokemon"),
    PokemonModule,
    CommonModule,
    SeedModule,
    // referencia a la base de datos de mongoDB
  ],
})
export class AppModule {}
