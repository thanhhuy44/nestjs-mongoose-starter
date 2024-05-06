import { Controller } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
@ApiBearerAuth('JWT-Auth')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
