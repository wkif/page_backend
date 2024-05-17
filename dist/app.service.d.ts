/// <reference types="multer" />
/// <reference types="node" />
export declare class AppService {
    getHello(): string;
    uploadFile(file: Express.Multer.File): Promise<{
        code: number;
        name: string;
    }>;
    getXlsxBuffer(path: string): Buffer;
}
