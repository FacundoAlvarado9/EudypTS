import * as Comlink from "comlink";
import { ManhattanComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TableDataComparator";

const manhattanComparator = new ManhattanComparator();
const comparator = new TableDataComparator(manhattanComparator);

Comlink.expose(comparator);