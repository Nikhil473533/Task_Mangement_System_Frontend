export interface taskResponse {
    id: number;
    title: string,
    description: string,
    createdAt: Date,
    deleted: boolean,
    taskStatus: string,
    updatedAt: Date
}