import type { Server } from 'node:http';

import { disconnect } from './db';

export function handleExceptions(error: unknown) {
  console.error(error);
  process.exitCode = 1;
}

export function handleServerExit(signal: string, server: Server) {
  return () => {
    console.info(`${signal} received! shutting down`);
    disconnect();

    server.close(() => {
      process.exitCode = 0;
    });
  };
}
