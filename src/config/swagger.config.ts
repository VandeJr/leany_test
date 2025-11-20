import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle('E-commerce API')
        .setDescription('API de E-commerce')
        .setVersion('1.0')
        .addTag('Users')
        .addTag('Products')
        .addTag('Cart')
        .addTag('Orders')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
};
