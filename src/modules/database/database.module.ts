import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({})
export default class DatabaseModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory(configService: ConfigService): TypeOrmModuleOptions {
                        const mysqlConnectionOptions = configService.get('db_config');
                        return mysqlConnectionOptions;
                    },
                }),
            ],
        };
    }
}
