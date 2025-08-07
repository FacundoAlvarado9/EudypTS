import * as Comlink from "comlink";
import { Manhattan, TSComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TSComparatorAdapter";

const tsComparatorInstance = new TSComparator();
const strategy = new Manhattan();
const comparator = new TableDataComparator(tsComparatorInstance);
comparator.setStrategy(strategy);

Comlink.expose(comparator);