import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v2");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // GENIAL!
      forbidNonWhitelisted: true, // GENIAL!
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  const PORT = process.env.PORT;
  await app.listen(PORT, () =>
    console.log(
      `😄 Server listening on Port: http://localhost:${PORT} enjoy your day, -wo/man. 😄`
    )
  );
}
bootstrap();
