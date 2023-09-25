import { server, port } from '@/main/config';
import { PgManager } from '@/infra/database';

PgManager.connect().then(() => {
  server.listen(port);
}).catch(error => console.log(error));
