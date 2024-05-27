export default () => ({
  port: 3000,
  database: {
    type: 'mysql',
    host: 'host',
    port: 3306,
    username: 'username',
    password: 'password',
    database: 'database',
    autoLoadEntities: true,
    synchronize: true,
  },
  JWT_SECRET: 'JWT_SECRET',
  oss: {
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeySecret',
    endpoint: 'endpoint',
    bucket: 'bucket',
    region: 'region',
  },
});
