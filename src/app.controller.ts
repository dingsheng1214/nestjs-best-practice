import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('getDBName')
    getDBName() {
        return this.configService.get('DB').name;
    }
}
