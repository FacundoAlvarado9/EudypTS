import type { ComparatorWorkerFactory } from "./WorkerFactory";

export class EuclideanComparatorFactory implements ComparatorWorkerFactory{
    create(): Worker {
        const worker = new Worker(new URL("../euclidean-comparator.worker.ts",import.meta.url), {type: "module"});
        return worker;
    }
}