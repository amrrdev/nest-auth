import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoffeesModule } from './coffees/coffees.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import DatabaseConfig from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (
        databaseConfigrations: ConfigType<typeof DatabaseConfig>,
      ) => ({
        type: 'postgres',
        host: databaseConfigrations.host,
        database: databaseConfigrations.database,
        port: Number(databaseConfigrations.port),
        username: databaseConfigrations.username,
        password: databaseConfigrations.password,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [DatabaseConfig.KEY],
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [DatabaseConfig] }),
    UsersModule,
    CoffeesModule,
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
