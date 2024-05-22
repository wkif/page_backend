import * as path from 'path';

export default () => ({
  port: 3000,
  uploadsPath: path.resolve(__dirname, '../../uploads/template'),
  cachePath: path.resolve(__dirname, '../../cache'),
  database: {
    type: 'mysql',
    host: '101.37.84.229',
    port: 3306,
    username: 'root',
    password: 'kifsmyssql',
    database: 'kifshomepage',
    autoLoadEntities: true,
    synchronize: true,
  },
  JWT_SECRET: 'kifshomepage_secret',
  oss: {
    accessKeyId: 'LTAI5t7QzTKsvcZ3W77W3XBK',
    accessKeySecret: 'XeBTILzUUoBvsviS7a1VwJ9t8tOjsp',
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    bucket: 'homepageoss',
    region: 'oss-cn-beijing',
  },
});
