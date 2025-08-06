import * as Comlink from "comlink";
import { TSComparator, UnweightedEuclidean } from "../utils/TSCompare";
import { TableDataComparator } from "../utils/adapter/TSComparatorAdapter";

const tsComparatorInstance = new TSComparator();
const strategy = new UnweightedEuclidean();
const comparator = new TableDataComparator(tsComparatorInstance);
comparator.setStrategy(strategy);

Comlink.expose(comparator);