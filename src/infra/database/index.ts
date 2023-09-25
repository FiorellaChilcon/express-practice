import { DataSource, DataSourceOptions, EntityTarget, ObjectLiteral, QueryRunner, Repository } from 'typeorm';
import { dbConfig } from './config';

export class PgManager {
  private queryRunners: QueryRunner[] = [];
  private static connection?: DataSource;
  private static _dataSource?: DataSource;

  static get dataSource(): DataSource {
    PgManager._dataSource = PgManager._dataSource ? PgManager._dataSource : new DataSource(dbConfig as DataSourceOptions);
    return PgManager._dataSource;
  }

  static async connect(): Promise<void> {
    const isInitialized = PgManager.connection?.isInitialized;
    if (!isInitialized) {
      PgManager.connection = await PgManager.dataSource.initialize();
    }
  }

  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    if (!PgManager.connection) throw new Error('Not connection found');
    const queryRunner = this.getQueryRunner();
    if (queryRunner) return queryRunner.manager.getRepository(entity);
    return PgManager.connection.getRepository(entity);
  }

  async openTransaction(): Promise<void> {
    console.log('Open database transaction');
    if (!PgManager.connection) throw new Error('Not connection found');
    const queryRunner = PgManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    this.queryRunners.push(queryRunner);
  }

  async closeTransaction(): Promise<void> {
    console.log('Close database transaction');
    const queryRunner = this.getQueryRunner();
    if (!queryRunner) throw new Error('Close - No transaction found');
    await queryRunner.release();
    this.queryRunners = this.queryRunners.filter(runner => runner !== queryRunner);
  }

  async commitTransaction(): Promise<void> {
    console.log('Commit database transaction');
    const queryRunner = this.getQueryRunner();
    if (!queryRunner) throw new Error('Commit - No transaction found');
    await queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    console.log('Rollback database transaction');
    const queryRunner = this.getQueryRunner();
    if (!queryRunner) throw new Error('Rollback - No transaction found');
    await queryRunner.rollbackTransaction();
  }

  async handleTransaction<T>(operations: () => Promise<T>): Promise<T | undefined> {
    let result: T | undefined;
    try {
      await this.openTransaction();
      result = await operations();
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    } finally {
      await this.closeTransaction();
    }

    return result;
  }

  private getQueryRunner(): QueryRunner | undefined {
    if (this.queryRunners.length === 0) return;
    return this.queryRunners[this.queryRunners.length - 1];
  }
}
