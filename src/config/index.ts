import developmentConfig from './dev';
import productionConfig from './prod';

const configs = {
  dev: developmentConfig,
  prod: productionConfig,
};
const env = process.env.RUNNING_ENV || 'prod';
console.log('----env----:', env);
export default () => configs[env];
