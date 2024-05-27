import developmentConfig from './env/dev';
import productionConfig from './env/prod';

const configs = {
  dev: developmentConfig,
  prod: productionConfig,
};
const env = process.env.RUNNING_ENV || 'prod';
console.log('----env----:', env);
export default () => configs[env];
