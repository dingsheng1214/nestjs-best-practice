import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule, ElasticsearchModuleOptions } from '@nestjs/elasticsearch';

@Module({})
export class ElasticModule {
    static forRoot(): DynamicModule {
        return {
            global: true,
            module: ElasticModule,
            imports: [
                ElasticsearchModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory(configService: ConfigService): ElasticsearchModuleOptions {
                        const elasticConfig = configService.get('elastic_config');
                        return { ...elasticConfig };
                    },
                }),
            ],
            exports: [ElasticsearchModule],
        };
    }
}
