// Dependencies
import { spawn } from 'child-process-promise';

// Local Dependencies
import * as config from '../src/db/config'

(async () => {
  const env = process.env.NODE_ENV || 'dev'
  const dbConfig = config[env]
  const spawnOptions = { stdio: 'inherit' };
  const url = `postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:5432/${dbConfig.database}`

try {
    // Migrate the DB
    await spawn('./node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions);
    console.log('*************************');
    console.log('Migration successful');
  } catch (err) {
    // Oh no!
    console.log('*************************');
    console.log('Migration failed. Error:', err.message);
    process.exit(1);
  }
process.exit(0);
})();

