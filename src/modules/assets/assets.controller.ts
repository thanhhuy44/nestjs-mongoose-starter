import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { GetUser } from '~/auth/decorator';
import { AuthGuard } from '~/auth/guard';
import { UserDocument } from '~/users/entities/user.entity';

import { AssetsService } from './assets.service';

@ApiTags('Asset')
@ApiBearerAuth('JWT-Auth')
@Controller('assets')
@UseGuards(AuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: UserDocument,
  ) {
    return await this.assetsService.create(file, user._id);
  }
}
