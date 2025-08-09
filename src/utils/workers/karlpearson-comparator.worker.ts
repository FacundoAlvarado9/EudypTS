import * as Comlink from "comlink";
import { KarlPearsonComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TSComparatorAdapter";

const karlPearsonComparator = new KarlPearsonComparator();
const comparator = new TableDataComparator(karlPearsonComparator);

Comlink.expose(comparator);