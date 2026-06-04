import { Controller, Get, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20'
  ) {
    return this.usersService.findAll(+page, +limit);
  }
  @Get(':id/projects')
  findUserProjects(@Param('id') id: string) {
    return this.usersService.findUserProjects(+id);
  }

  @Get(':id/issues')
  findUserIssues(@Param('id') id: string) {
    return this.usersService.findUserIssues(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log("Received update request for user ID:", id);
    console.log("Update data:", updateUserDto);
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({summary: 'Upload user avatar'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar file (jpg, jpeg, png) max 4MB',
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
  
  @ApiOkResponse({ description: 'Avatar uploaded successfully' })
  @ApiBadRequestResponse({ description: 'Invalid file type or no file provided' })
  @Put(':id/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Only images are allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 4 * 1024 * 1024,
      },
    }),
  )

  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File required');
    }
    
    const filePath = `/uploads/avatars/${file.filename}`;
    return this.usersService.updateAvatarUrl(+id, filePath);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
