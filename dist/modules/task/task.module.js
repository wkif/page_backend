"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const config_1 = require("../../common/config");
const task_service_1 = require("./task.service");
const task_controller_1 = require("./task.controller");
const task_entity_1 = require("./entity/task.entity");
const taskHistory_1 = require("./entity/taskHistory");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const user_service_1 = require("../user/user.service");
const app_service_1 = require("../../app.service");
const axios_1 = require("@nestjs/axios");
let TaskModule = class TaskModule {
};
exports.TaskModule = TaskModule;
exports.TaskModule = TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task, user_entity_1.User, taskHistory_1.TaskHistory]),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: (0, config_1.default)().uploadsPath,
                    filename: (req, file, callback) => {
                        const fileName = `${req.body.userId}__${req.body.type == 1 ? 'daily' : 'monthly'}__${new Date().getTime() + path.extname(file.originalname)}`;
                        return callback(null, fileName);
                    },
                }),
            }),
            axios_1.HttpModule,
        ],
        providers: [task_service_1.TaskService, user_service_1.UserService, app_service_1.AppService],
        controllers: [task_controller_1.TaskController],
    })
], TaskModule);
//# sourceMappingURL=task.module.js.map