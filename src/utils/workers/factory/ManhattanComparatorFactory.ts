import type { ComparatorWorkerFactory } from "./WorkerFactory";

export class ManhattanComparatorFactory implements ComparatorWorkerFactory{
    create(): Worker {
        const worker = new Worker(new URL("../manhattan-comparator.worker.ts",import.meta.url), {type: "module"});
        return worker;
    }
}