export interface WorkerFactory {
    create() : Worker;
}

export abstract class ComparatorWorkerFactory implements WorkerFactory{
    abstract create() : Worker;
}