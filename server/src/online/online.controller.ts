import { Controller } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { CreateOnlineDto } from "./dto/create-online.dto";
import { OnlineService } from "./online.service";

@Controller("online")
export class OnlineController {
  constructor(private onlineService: OnlineService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<CreateOnlineDto[]> {
    const data = await this.onlineService.findAll();
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("create")
  async create(@Body() online: CreateOnlineDto): Promise<CreateOnlineDto[]> {
    const data = await this.onlineService.create(online);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @Post("delete")
  async delete(@Body() online: CreateOnlineDto): Promise<CreateOnlineDto[]> {
    const data = await this.onlineService.delete(online);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }
}
