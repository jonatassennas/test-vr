import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  private readonly statusMap: Map<string, string> = new Map();

  setStatus(id: string, status: string): void {
    this.statusMap.set(id, status);
  }

  getStatus(id: string): string | undefined {
    return this.statusMap.get(id);
  }
}
