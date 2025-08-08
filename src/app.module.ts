import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {} from './products/products.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { CarInfoModule } from './car-info/car-info.module';
import { StripeModule } from './stripe/stripe.module';
import { CacheModule } from '@nestjs/cache-manager';
import { IdsModule } from './ids/ids.module';
import { CartModule } from './cart/cart.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'mydb'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false, // ❗ true - только в dev-режиме!
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
          queueLimit: 0,
          keepAliveInitialDelay: 10000,
          enableKeepAlive: true,
          connectTimeout: 10000,
        },
      }),
    }),
    // CacheModule.register({
    //   store: 'redis',
    //   host: process.env.REDIS_HOST || 'localhost', // Используем переменные окружения
    //   port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    //   ttl: parseInt(process.env.REDIS_TTL, 10) || 1800, // Время жизни кеша
    // }),
    ProductsModule,
    CarInfoModule,
    OrderModule,
    ProductsModule,
    UserModule,
    AuthModule,
    CategoriesModule,
    CarInfoModule,
    StripeModule,
    IdsModule,
    CartModule,
    RedisModule,
  ],
})
export class AppModule {}
