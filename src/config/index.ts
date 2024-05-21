import developmentConfig from './dev';
import productionConfig from './prod';

const configs = {
  dev: developmentConfig,
  prod: productionConfig,
};
const env = process.env.RUNNING_ENV || 'dev';
console.log('----env----:', env);
export default () => configs[env];
