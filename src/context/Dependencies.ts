import parseCSVFile from "../utils/csvParser";
import { EuclideanComparatorFactory, KarlPearsonComparatorFactory, ManhattanComparatorFactory } from "../utils/workers";
import type { Dependencies } from "./Dependencies.types";

export const appDependencies : Dependencies = {
    parseCSVFile: parseCSVFile,
    factories: [
        {
            name: "Euclidean",
            factory: () => new EuclideanComparatorFactory()
        },
        {
            name: "Manhattan",
            factory: () => new ManhattanComparatorFactory()
        },
        {
            name: "Karl-Pearson",
            factory: () => new KarlPearsonComparatorFactory()
        }
    ]
}