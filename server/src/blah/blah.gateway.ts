import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { BlahService } from "./blah.service";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: ["http://localhost:3000"],
  },
})
export class BlahGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger("Gateway");
  constructor(private blahService: BlahService) {}

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    this.nsp.adapter.on("create-room", (room) => {
      this.logger.log(`"Room:${room}"이 생성되었습니다.`);
    });

    this.nsp.adapter.on("join-room", (room, id) => {
      this.logger.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    });

    this.nsp.adapter.on("leave-room", (room, id) => {
      this.logger.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    });

    this.nsp.adapter.on("delete-room", (roomName) => {
      this.logger.log(`"Room:${roomName}"이 삭제되었습니다.`);
    });

    this.logger.log("웹소켓 서버 초기화 ✅");
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);

    socket.broadcast.emit("message", {
      message: `${socket.id}가 들어왔습니다.`,
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
  }

  @SubscribeMessage("message")
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const result = await this.blahService.findById(data._id);
    socket.broadcast.emit("message", { username: data.username });
    return result;
  }

  @SubscribeMessage("chat")
  async handleChat(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.broadcast.emit("chat", { username: data.email });
    return null;
  }
}
