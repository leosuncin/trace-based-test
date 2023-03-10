import { cleanEnv, port, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test', 'ci'],
    default: 'development',
  }),
  PORT: port({ default: 3000 }),
  MONGO_URL: url({ devDefault: 'mongodb://localhost/admin' }),
  ALLOWED_ORIGINS: str({
    default: '*',
    example: 'localhost:3000,localhost',
  }),
});
