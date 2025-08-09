import type { ComparatorWorkerFactory } from "./WorkerFactory";

export class KarlPearsonComparatorFactory implements ComparatorWorkerFactory{
    create(): Worker {
        const worker = new Worker(new URL("../karlpearson-comparator.worker.ts",import.meta.url), {type: "module"});
        return worker;
    }
}