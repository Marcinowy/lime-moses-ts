import { createConnection, Connection, ConnectionOptions } from '../node_modules/mysql2/promise';

export class DatabaseConnector {

  private connectionOptions: ConnectionOptions;
  private connection?: Connection;

  constructor(connectionOptions: ConnectionOptions) {
    this.connectionOptions = connectionOptions;
  }

  protected async getConnection() {
    if (!this.connection) {
      this.connection = await createConnection(this.connectionOptions);
    }

    return this.connection;
  }

}