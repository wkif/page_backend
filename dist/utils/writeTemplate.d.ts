declare const writeTemplate: (filePath: string, tasksData: any[], templateData: {
    label: string;
    row: number;
    col: number;
}[]) => Promise<unknown>;
export default writeTemplate;
