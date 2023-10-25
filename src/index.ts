import { server, port } from '@/main/config';
import { PgManager } from '@/infra/database';
import { RedisManager } from '@/infra/gateways';

Promise.all([PgManager.connect(), RedisManager.connect()])
  .then(async () => {
    server.listen(port);
  })
  .catch(error => console.log(error));
