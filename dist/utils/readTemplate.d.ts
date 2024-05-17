declare const readTemplate: (filePath: string) => Promise<{
    label: string;
    row: number;
    col: number;
}[]>;
export default readTemplate;
