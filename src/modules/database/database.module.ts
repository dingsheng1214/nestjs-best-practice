import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDataSourceToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from './constant';
import { DataExistConstraint } from './constraint/data.exist.constraint';
import { UniqueConstraint } from './constraint/unique.constraint';
import { UniqueTreeConstraint } from './constraint/unique.tree.constraint';

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
                        return { ...mysqlConnectionOptions };
                    },
                }),
            ],
            providers: [DataExistConstraint, UniqueConstraint, UniqueTreeConstraint],
        };
    }

    /**
     * 注册自定义Repository
     * @param repositories 需要注册的自定义类列表
     * @param dataSourceName 数据池名称,默认为默认连接
     */
    static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];
        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

            if (!entity) {
                continue;
            }
            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): InstanceType<typeof Repo> => {
                    const baseRepository = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(
                        baseRepository.target,
                        baseRepository.manager,
                        baseRepository.queryRunner,
                    );
                },
            });
        }
        return {
            exports: providers,
            module: DatabaseModule,
            providers,
        };
    }
}
