import { Controller, Get, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
