import * as Comlink from "comlink";
import { Manhattan, TSComparator } from "../utils/TSCompare";
import { TableDataComparator } from "../utils/adapter/TSComparatorAdapter";

const tsComparatorInstance = new TSComparator();
const strategy = new Manhattan();
const comparator = new TableDataComparator(tsComparatorInstance);
comparator.setStrategy(strategy);

Comlink.expose(comparator);