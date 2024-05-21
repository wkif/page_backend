"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.IS_DEV = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./modules/user/user.module");
const auth_module_1 = require("./modules/auth/auth.module");
const jwt_auth_grard_1 = require("./modules/auth/jwt-auth.grard");
const config_2 = require("./common/config");
const core_1 = require("@nestjs/core");
const links_module_1 = require("./modules/links/links.module");
const task_module_1 = require("./modules/task/task.module");
const axios_1 = require("@nestjs/axios");
exports.IS_DEV = process.env.RUNNING_ENV !== 'prod';
const envFilePath = [];
if (exports.IS_DEV) {
    envFilePath.unshift('.env.dev');
}
else {
    envFilePath.unshift('.env.prod');
}
console.log('IS_DEV', exports.IS_DEV, process.env.MYSQL_HOST);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.default],
                envFilePath,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                port: process.env.MYSQL_PORT,
                username: process.env.MYSQL_USERNAME,
                host: process.env.MYSQL_HOST,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                synchronize: true,
                autoLoadEntities: true,
            }),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: path.join(__dirname, '../uploads'),
                    filename: (_, file, callback) => {
                        const fileName = `${new Date().getTime() + path.extname(file.originalname)}`;
                        return callback(null, fileName);
                    },
                }),
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            links_module_1.LinksModule,
            task_module_1.TaskModule,
            axios_1.HttpModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_grard_1.jwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map