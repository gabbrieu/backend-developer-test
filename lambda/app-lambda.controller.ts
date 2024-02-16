import { Controller, Post } from '@nestjs/common';
import { AppLambdaService } from './app-lambda-service';

// TODO: REMOVE CONTROLLER
@Controller('test')
export class AppLambdaController {
    constructor(private readonly appLambdaService: AppLambdaService) {}

    @Post()
    async feed() {
        return this.appLambdaService.saveJobFile();
    }
}
