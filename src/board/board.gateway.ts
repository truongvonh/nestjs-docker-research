import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  BOARD_EMIT_EVENT,
  BOARD_NAME_SPACE,
  BOARD_SCRIBE_EVENT,
} from './constants/socket.constant';

@WebSocketGateway(BOARD_NAME_SPACE)
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('BoardGateway');

  @SubscribeMessage('msgToServer')
  public handleMessage(client: Socket, payload: any) {
    return this.server.to(payload.room).emit('msgToClient', payload);
  }

  @SubscribeMessage(BOARD_SCRIBE_EVENT.JOIN_ROOM)
  public joinRoom(client: Socket, room: string): void {
    this.logger.log(room);
    client.join(room);
    client.emit(BOARD_EMIT_EVENT.JOINED_ROOM, room);
  }

  @SubscribeMessage(BOARD_SCRIBE_EVENT.LEAVE_ROOM)
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit(BOARD_EMIT_EVENT.LEFT_ROOM, room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
