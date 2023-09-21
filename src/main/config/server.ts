#!/usr/bin/env node

import { app, env } from './';
import Debug from 'debug';
import http from 'http';

const debug = Debug('express-practice:server');

/**
 * Event listener for HTTP server "error" event.
 */
function _onError(error: any) {
  if (error?.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error?.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function _onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}

/**
 * Get port from environment and store in Express.
 */
const port = env.server.port;
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

server.on('error', _onError);
server.on('listening', _onListening);

export { server, port };
