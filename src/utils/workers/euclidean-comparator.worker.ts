import * as Comlink from "comlink";
import { EuclideanComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TSComparatorAdapter";

const euclideanComparator = new EuclideanComparator();
const comparator = new TableDataComparator(euclideanComparator);

Comlink.expose(comparator);