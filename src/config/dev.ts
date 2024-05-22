export default () => ({
  port: 3000,
  database: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'neststudy',
    password: 'neststudy',
    database: 'neststudy',
    autoLoadEntities: true,
    synchronize: true,
  },
  JWT_SECRET: 'neststudy',
  oss: {
    accessKeyId: 'LTAI5t7QzTKsvcZ3W77W3XBK',
    accessKeySecret: 'XeBTILzUUoBvsviS7a1VwJ9t8tOjsp',
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    bucket: 'homepageosst',
    region: 'oss-cn-beijing',
  },
});
