import * as Comlink from "comlink";
import { TSComparator, UnweightedEuclidean } from "../TSCompare";
import { TableDataComparator } from "../adapter/TSComparatorAdapter";

const tsComparatorInstance = new TSComparator();
const strategy = new UnweightedEuclidean();
const comparator = new TableDataComparator(tsComparatorInstance);
comparator.setStrategy(strategy);

Comlink.expose(comparator);