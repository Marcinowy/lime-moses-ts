import { RowDataPacket } from '../node_modules/mysql2/promise';

export interface DbRider extends RowDataPacket {
  id: number;
  token: string;
}
