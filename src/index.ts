import { AppDataSource } from './infra/data-source';
import { server, port } from './main/config';

AppDataSource.initialize().then(async () => {
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
}).catch(error => console.log(error));
