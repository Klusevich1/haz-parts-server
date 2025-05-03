import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {  } from './products/products.module';
import { ApplicationModule } from './application/application.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'mydatabase'),
        autoLoadEntities: true,
        synchronize: true, // Только для разработки, в проде отключить!
      }),
    }),
    ProductsModule,
    ApplicationModule,
    OrderModule,
    ProductsModule,
    UserModule,
    AuthModule,
    CategoriesModule,
  ],
})
export class AppModule {}
