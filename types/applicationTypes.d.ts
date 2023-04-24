export interface WorkerMessage {
    messageType: string;
    timeMillis: number;
    pid: number;
}
