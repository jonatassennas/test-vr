import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  constructor(private readonly socket: Socket) {}

  onStatusUpdate(): Observable<any> {
    return this.socket.fromEvent('updateStatus');
  }
}
