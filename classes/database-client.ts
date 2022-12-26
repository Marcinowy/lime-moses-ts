import { DatabaseConnector } from './database-connector';
import { Connection, ConnectionOptions, ResultSetHeader } from '../node_modules/mysql2/promise';
import { Rider } from './rider';
import { DbRider } from '../interfaces/db-rider';

export class DatabaseClient extends DatabaseConnector {

  constructor(connectionOptions: ConnectionOptions) {
    super(connectionOptions);
  }

  async getRiders(count: number): Promise<Rider[]> {
    const connection: Connection = await this.getConnection();
    const sql = 'SELECT `token`, `id` FROM `lime_accounts` WHERE `active` = 1 ORDER BY `last_call_time`, `called` LIMIT ?';
    const [rows] = await connection.query<DbRider[]>(sql, [count]);

    return rows.map<Rider>((el: DbRider) => {
      return new Rider(el);
    });
  }

  async setUsed(riders: Rider[]): Promise<void> {
    const ids: number[] = riders.map<number>((el: Rider) => {
      return el.getId();
    });

    const connection: Connection = await this.getConnection();
    const sql = 'UPDATE `lime_accounts` SET `called` = `called` + 1, `last_call_time` = UNIX_TIMESTAMP() WHERE id IN (?)';
    const [details] = await connection.query<ResultSetHeader>(sql, [ids]);
    if (details.affectedRows !== ids.length) {
      throw new Error('Cannot set accounts as used');
    }
  }

  async setError(riders: Rider[]): Promise<void> {
    const ids: number[] = riders.map<number>((el: Rider) => {
      return el.getId();
    });

    const connection: Connection = await this.getConnection();
    const sql = 'UPDATE `lime_accounts` SET `errors` = `errors` + 1, `last_call_time` = UNIX_TIMESTAMP() WHERE id IN (?)';
    const [details] = await connection.query<ResultSetHeader>(sql, [ids]);
    if (details.affectedRows !== ids.length) {
      throw new Error('Cannot set error for accounts');
    }
  }
}