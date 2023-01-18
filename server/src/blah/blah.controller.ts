import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Query, UseGuards } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "src/auth/jwt.guard";
import { BlahService } from "./blah.service";
import { Blah } from "./schemas/blah.schema";
import { AddBlah } from "./dto/add-blah.dto";
import { AddChat } from "./dto/add-chat.dto";
import { CountUpdate } from "./dto/update-count.dto";
import { Response } from "@nestjs/common/decorators/http/route-params.decorator";
import { NotReadBlah } from "./dto/notRead-blah.dto";
import { StatusBlah } from "./dto/status-blah.dto";
import { AddPartner } from "./dto/add-partner.dto";

@Controller("blah")
export class BlahController {
  constructor(private blahService: BlahService) {}

  @UseGuards(JwtAuthGuard)
  @Post("create")
  @HttpCode(201)
  async create(@Body() addBlah: AddBlah) {
    const data = await this.blahService.create(addBlah);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @Post("createAI")
  @HttpCode(201)
  async creatAI(@Body() addBlah: AddBlah) {
    return this.blahService.create(addBlah);
  }

  @UseGuards(JwtAuthGuard)
  @Post("findOne")
  async findOne(@Body() addBlahDto: AddBlah) {
    const data = await this.blahService.findOne(addBlahDto);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query("email") email: string): Promise<Blah[]> {
    const foundBlahRooms = await this.blahService.findAll(email);
    return Object.assign({
      data: foundBlahRooms,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get("room")
  async findById(@Query("id") id: string): Promise<Blah[]> {
    const foundBlahRoom = await this.blahService.findById(id);
    return Object.assign({
      data: foundBlahRoom,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("chatAdd")
  async add(@Body() addChatDto: AddChat) {
    const data = await this.blahService.add(addChatDto);
    return Object.assign({
      data: data,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("updateCount")
  async countUpdate(@Body() data: CountUpdate) {
    const datas = await this.blahService.countUpdate(data);
    return Object.assign({
      data: datas,
      statusCode: 200,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("notRead")
  async notRead(@Body() data: NotReadBlah) {
    return await this.blahService.notRead(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("statusChange")
  async statusChange(@Body() data: StatusBlah) {
    return await this.blahService.statusChange(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("addPartner")
  async addPartner(@Body() data: AddPartner) {
    return await this.blahService.addPartner(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.blahService.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Get("download")
  downloadFile(@Response() res, @Query("filename") filename) {
    return this.blahService.downloadFile(res, filename);
  }
}
