# EudypTS
- [1. Project Overview](#1-project-overview)
- [2. Set-up and installation](#2-set-up-and-installation)
  - [2.1. Prerequisites](#21-prerequisites)
  - [2.2. Getting the Source-Code](#22-getting-the-source-code)
    - [Option A: Cloning the project's repository](#option-a-cloning-the-projects-repository)
    - [Option B: Downloading the source code as a ZIP file](#option-b-downloading-the-source-code-as-a-zip-file)
  - [2.3. Running the project](#23-running-the-project)
- [3. Project structure](#3-project-structure)
  - [3.1. Overview on React Components](#31-overview-on-react-components)
    - [3.1.1. Main UI Component](#311-main-ui-component)
    - [3.1.2. DatasetEditor Component](#312-dataseteditor-component)
    - [3.1.3. DataTable Component](#313-datatable-component)
    - [3.1.4. Components for the charts](#314-components-for-the-charts)
  - [3.2. Comparison logic](#32-comparison-logic)
    - [3.2.1. General Approach](#321-general-approach)
    - [3.2.1. TSComparator](#321-tscomparator)
      - [3.2.1.1. TSComparator interface](#3211-tscomparator-interface)
      - [3.2.1.2. TSComparator implementations](#3212-tscomparator-implementations)
    - [3.2.2. TableData adapter](#322-tabledata-adapter)
    - [3.2.3. Web-workers](#323-web-workers)
  - [3.3. Running the comparison in the React Application](#33-running-the-comparison-in-the-react-application)
    - [3.3.1. The useTSCompare custom-hook](#331-the-usetscompare-custom-hook)
  - [3.4. How to add a new distance measure](#34-how-to-add-a-new-distance-measure)
    - [3.4.1. Implement the specific comparator](#341-implement-the-specific-comparator)
    - [3.4.2. Implement the worker](#342-implement-the-worker)
    - [3.4.3. Implement a Factory for it](#343-implement-a-factory-for-it)
    - [3.4.4. Add it to the app dependencies](#344-add-it-to-the-app-dependencies)
- [References](#references)

# 1. Project Overview
The EudypTS web-application allows for the comparison of two time-series using a visual comparison technique developed at the Universidad Nacional del Sur in Argentina [1]. Users can upload both a _reference_ and _target_ time-series dataset in CSV format, pre-process/edit them, select an appropriate distance measure, and then visualize their comparison using the aforementioned technique.

EudypTS is a React web-application implemented with Typescript, built with Vite, and with NPM as the package-manager. Other libraries used in the project include Echarts for data visualization and interaction; Handsontable for interactive data-tables; and Comlink for web-workers.

The following is a developer's guide to the EudypTS project and provides a general overview on the codebase for this project. For a guide on how to use the web-application, refer to the [project's user guide](/user-guide/EudypTS_User-guide.pdf). For a thorough insight on the project's purpose and development, refer to the [main article related to the project](/user-guide/original-article.pdf).

# 2. Set-up and installation
This section explores the different ways to set-up the project for local development
## 2.1. Prerequisites
1. **Git**, if you want to clone the project.
2. **Node.js** version 18.18 or newer.
3. **NPM Package-manager**
All these tools must be accessible from your system's PATH environment variable.

## 2.2. Getting the Source-Code
### Option A: Cloning the project's repository
The first option to get the source code is to clone the project's main repository on GitHub.
1. Open a terminal or command prompt
2. Navigate to the directory where you want to clone the project
3. Clone the project's repository by using the Git's command for that purpose

``git clone https://github.com/FacundoAlvarado9/EudypTS.git``

3. Navigate to the directory where the project was cloned

``cd EudypTS``

### Option B: Downloading the source code as a ZIP file
1. On the project's main repository, click on the green "Code" button
2. Click on the "Download ZIP" option
3. Select a directory from your file-system where you want to save the project's ZIP
4. Extract the ZIP file on a directory of your preference

## 2.3. Running the project
Once the source code was downloaded, the web-application can run on a local development server.

1. Open a terminal or command prompt on the project's main directory. As orientation, it is the directory in which the _package.json_ file may be found.
2. Install the dependencies by running

``npm install``

3. You may start the local development server by running

``npm run dev``

Access the URL printed on the console with your browser in order to access the web-application.

# 3. Project structure
Let us first explore the project's directory structure
```
EudypTS/
├── public/
│   ├── ...
├── src/
│   ├── components/
│   │   └─...
│   ├── hooks/
│   │   └─...
│   ├── types/
│   │   └─...
│   ├── utils/
│   │   └─...
│   ├── App.tsx
│   └── ...
└── ...
```

## 3.1. Overview on React Components
We will now review the most important React components of this application. Except for the ``App.tsx`` component, all of them will be found in the ``/src/components`` directory.

```
EudypTS/
├── src/
│   ├── components/
│   │   ├─ ui/
│   │   └─ charts/
│   ├── App.tsx
│   └── ...
└── ...
```

### 3.1.1. Main UI Component
The ``App.tsx`` is the main UI component as it renders the main screen of the application. It renders other components such as:

- The ``DatasetEditor`` component for uploading and editing each dataset.
- The distance dropdown selector with the "Compare" button.
- The ``DetailedView`` component in which the visualizations are rendered.
- The ``ErrorAlert`` component, which visually notifies the user of any errors.

Aditionally, it makes use of the ``useTSCompare`` custom React-hook that encapsulates all the logic related to the time-series comparison.

### 3.1.2. DatasetEditor Component
The ``DatasetEditor`` component renders:

- A ``FileUploader`` component for uploading the datasets.
- The dropdown selector ``DateColumnSelector`` for choosing one of the columns of the dataset as the _timestamp_ of the time-series.
- The ``DataTable`` component, which allows the user to edit the datasets in order to ensure that it is a valid time-series at the time of comparison.

This component includes some logic in order to let the external library _PapaParse_ to parse the CSV files uploaded by the user. Datasets are parsed into the ``TableData`` type, defined as follows in the ``Dataset.ts`` file in the ``/src/types`` sub-directory.

```ts
export type Cell = string;
export type Header = string;
export type Row = Array<Cell>;

export type TableData = {
    headers : Array<Header>;
    data : Array<Row>;
};
```

That is, the uploaded datasets are parsed into a set of ``headers`` (as column headers), and an array of arrays of strings called ``data``.

### 3.1.3. DataTable Component
The ``DataTable`` component renders a data-table provided by the external library _Handsontable_. It also contains logic for propagating changes made on the datasets to the ``useTSCompare`` custom React-hook, where the datasets are stored in state variables.

### 3.1.4. Components for the charts
The React components dedicated to the visualizations can be found in the ``/src/components/charts`` sub-directory. There, the three React components dedicated to each of the visualizations that make up the comparison technique can be found.

As a general rule when it comes to the visualization components, those that start with the letter 'E' contain ECharts' logic and generate an ECharts-chart. Those that do not start with 'E' contain general logic for rendering ECharts components or other UI elements.

```
EudypTS/
├── src/
│   ├── components/
│   │   ├─ ui/
│   │   └─ charts/
│   │       ├─ heatmap/
│   │       │    ├─ EHeatmapParallelCoord.tsx
│   │       │    ├─ HeatmapParallelCoord.tsx
│   │       │    ├─ HeatmapOptions.tsx
│   │       │    └─ ...
│   │       ├─ EDetailedView.tsx
│   │       ├─ EDistanceGraph.tsx
│   │       ├─ EMisalignmentGraph.tsx
│   │       └─ colorscales.ts
│   ├── App.tsx
│   └── ...
└── ...
```

The ``EDetailedView`` is the main visualization component and renders the three visualization-related components. These are the ``EDistanceGraph``, the ``EMisalignmentGraph`` and the ``HeatmapParallelCoord`` components.

Since the logic of the parallel-heatmaps visualization is more complex, it was separated into more than one component and kept in a separate ``/src/components/charts/heatmap/`` sub-directory. The ``HeatmapParallelCoord`` takes the result-data as _props_ and renders the ``HeatmapOptions`` component, which contains the color-scale and min/max options for each parallel-heatmaps chart; and the ``EHeatmapParallelCoord`` component which contains the actual ECharts configuration for rendering the visualization.

## 3.2. Comparison logic

### 3.2.1. General Approach
During development, the problem of comparing two formal time-series was tackled first. We considered a time-series as an ordered array of numerical sub-arrays, where each numerical sub-array is an observation or measurement made at a certain point in time. The numerical sub-array at index 0 is considered the first observation in the time-series. The one at the last index is considered the last observation. A numerical sub-array at an index n (that is not the first or last) models an observation that succeeds the observation at index n-1 and precedes the observation at index n+1.

Later in development, the ``TableData`` type was conceived for allowing the user to edit the raw datasets. The adapter pattern was picked in order to allow the comparison of two ``TableData`` objects.

### 3.2.1. TSComparator

```
EudypTS/
├── src/
│   ├── utils/
│   │   └─ TSCompare/
│   │       ├─ comparators/
│   │       │    ├─ EuclideanComparator.ts
│   │       │    ├─ KarlPearsonComparator.ts
│   │       │    └─ ManhattanComparator.ts
│   │       ├─ types/
│   │       │    └─ TSComparator.types.ts
│   │       ├─ utils/
│   │       │    ├─ WelfordAlgorithmHelper.ts
│   │       │    └─ StdDevHelper.ts
│   │       └─ TSComparator.ts
│   └── ...
└── ...
```

#### 3.2.1.1. TSComparator interface
For the comparison of two time-series, a TSComparator interface was defined as follows

```ts
export interface TSComparator {
    compare(reference : TimeSeries, target : TimeSeries) : ComparisonResult;
}
```

With a time-series being defined as:

```ts
export type NDimensionalPoint = Array<number>;
export type TimeSeries = Array<NDimensionalPoint>;
```


And with the comparison result being a ``ResultEntry`` for each point in the reference time-series,

```ts
export type ResultEntry = {
    index : number;
    warping : number; // its best-match in the target time-series
    distance : number; // the distance to its best-match
    misalignment : number; // the value of the misalignment function at its position
    degree_of_misalignment : number; // the value of the degree-of-misalignment function at its position
}
export type ComparisonResult = Array<ResultEntry>;
```

More information on each of these values can be found in the article related to this project.

#### 3.2.1.2. TSComparator implementations
As stated in the article related to this project, any distance function can be used for the comparison of two time-series. For example, the Euclidean distance or the Karl-Pearson distance. For this purpose, many time-series comparators or _TSComparators_ implement the ``TSComparator`` interface, for instance, the ``EuclideanComparator``, the ``KarlPearsonComparator`` and the ``ManhattanComparator``. These can be found in the ``/src/utils/TSCompare/comparators`` sub-directory. Some helper classes were implemented (e.g. for calculating the standard deviation of the variables, which is needed for the Karl-Pearson distance measure).

It is worth mentioning that these TSComparator implementations do not implement the ``TSComparator`` interface directly. They extend an abstract class called ``AbstractTSComparator`` that implements all the comparison-specific (mostly Dynamic-Time-Working-related) operations except the distance function, which is left unimplemented.

### 3.2.2. TableData adapter
As mentioned before, the datasets uploaded by the user are parsed into ``TableData`` objects for easier editing on their part. ``TableData`` objects are arrays of sub-arrays of strings that represent a series of rows. No restrictions are imposed on them in terms of resembling a time-series. In order to be able to compare two ``TableData`` objects that may or may not resemble a time-series, the adapter pattern was implemented.

First, a ``ITableDataComparator`` was defined as follows

```ts
export interface ITableDataComparator {
    compare(reference : TableData, target : TableData) : AdaptedResult;
}
```

With the adapted result defined as

```ts
export type AdaptedResult = {
    status : "Success" | "Error";
    errorMessage? : any;
    result ?: ComparisonResult;
}
```

A status variable is included in order to facilitate error handling in the React application.

The ``ITableDataComparator`` is then implemented by the ``TableDataComparator`` class, which keeps a TSComparator instance (see section 3.2.1.2.) as the``adaptee``. It also keeps record of the index of the _timestamp columns_ for both the _reference_ and _target_ ``TableData``, and exposes the corresponding methods to update them. The ``TableDataComparator`` class is responsible for checking the validity of the datasets as time-series, convert them into time-series, and then delegates the comparison to the ``adaptee``.

![Class Diagram](/readme-img/tscomp_class.png)

### 3.2.3. Web-workers
In order to run the potentially time- and memory-complex calculations of the Dynamic-Time-Warping-based comparison technique in a thread other than the UI thread, Web-Workers were implemented. Each of these web-workers create an instance of a specific ``TSComparator`` and loads it as an adaptee to an instance of ``TableDataComparator``, it then exposes the methods of this last object to the main-thread. Comlink abstracts the RPC (Remote-Procedure-Call) logic behind working with web-workers.

```ts
import * as Comlink from "comlink";
import { EuclideanComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TableDataComparator";

const euclideanComparator = new EuclideanComparator();
const comparator = new TableDataComparator(euclideanComparator);

Comlink.expose(comparator);
```

A Factory pattern was implemented for instantiating web-workers from the React application.

```ts
export interface WorkerFactory {
    create() : Worker;
}

export abstract class ComparatorWorkerFactory implements WorkerFactory{
    abstract create() : Worker;
}
```

With the EuclideanComparator factory looking like the follwing 

```ts
export class EuclideanComparatorFactory implements ComparatorWorkerFactory{
    create(): Worker {
        const worker = new Worker(new URL("../euclidean-comparator.worker.ts",import.meta.url), {type: "module"});
        return worker;
    }
}
```

## 3.3. Running the comparison in the React Application
### 3.3.1. The useTSCompare custom-hook
A custom hook allows the usage of React logic without rendering any UI elements. It allows for the encapsulation of logic. As mentioned before, the ``App.tsx`` component is the main UI-related component. In order not to add more responsibilities to it, a decision was made to keep the comparison logic in a custom-hook, the ``useTSCompare`` custom-hook. It can be found in the ``/src/hooks`` sub-directory.

The ``useTSCompare`` custom-hook keeps both _reference_ and _target_ datasets as state variables. It also keeps the indexes of the _timestamp_ columns the user picks by making use of the dropdown selectors on top of the data-tables; and the distance-measure chosen by the user.

It contains logic for instantiating the worker that corresponds to the chosen distance-measure and running the comparison. The result is then stored in a state variable.

Many optimizations were put in place: Workers that were instantiated are stored for later use and the result is not recalculated if neither the chosen distance-measure nor any of the datasets change.

## 3.4. How to add a new distance measure
Let us now add a new distance measure: the Chebyshev distance

The Chebyshev distance measures the distance between two multi-dimensional points as the greatest absolute difference along any coordinate dimension.

![Chebyshev Distance](/readme-img/chebyshev.png)

### 3.4.1. Implement the specific comparator
Considering the specifics of the technique, this could be an implementation (good enough for our simple tutorial)

```ts
//ChebyshevComparator.ts
import { AbstractTSComparator } from "../TSComparator";
import type { NDimensionalPoint } from "../types/TSComparator.types";

export class ChebyshevComparator extends AbstractTSComparator{
    constructor(){
        super();
    }

    protected distance(point1: NDimensionalPoint, point2: NDimensionalPoint): number {
        let max_dist = 0;
        point1.forEach((coord, index) => {
            const current_diff = Math.abs(coord-point2[index]);
            if(current_diff > max_dist){
                max_dist = current_diff
            }
        });
        return max_dist;
    }
}
```
Let's save it in ``/src/utils/TSCompare/comparators`` as ``ChebyshevComparator.ts``.

**Note:** You can add it to the index file ``src/utils/TSCompare/index.ts`` in order to simplify imports from the outer world. The ``index.ts`` file will look something like

```ts
//Types
export * from './types/TSComparator.types';

//Helpers
export * from './utils/StdDevHelper';

//Comparators
export * from './TSComparator';
export * from './comparators/EuclideanComparator';
export * from './comparators/KarlPearsonComparator';
export * from './comparators/ManhattanComparator';
export * from './comparators/ChebyshevComparator'; // <-- our new comparator!
```

### 3.4.2. Implement the worker
You may add the worker as ``chebyshev-comparator.worker.ts`` in the ``/src/utils/workers/`` sub-directory. It may look something like

```ts
//chebyshev-comparator.worker.ts
import * as Comlink from "comlink";
import { ChebyshevComparator } from "../TSCompare";
import { TableDataComparator } from "../adapter/TableDataComparator";

const chebyshevComparator = new ChebyshevComparator();
const comparator = new TableDataComparator(chebyshevComparator);

Comlink.expose(comparator);
```

### 3.4.3. Implement a Factory for it
This new factory may be called ``ChebyshevComparatorFactory.ts``. The place for specific factory classes is the ``/src/utils/workers/factory/`` sub-directory. This new factory may look something like

```ts
import type { ComparatorWorkerFactory } from "./WorkerFactory";

export class ChebyshevComparatorFactory implements ComparatorWorkerFactory{
    create(): Worker {
        const worker = new Worker(new URL("../chebyshev-comparator.worker.ts",import.meta.url), {type: "module"});
        return worker;
    }
}
```

### 3.4.4. Add it to the app dependencies
This project uses React-Context-based dependency-injection. React-Context provides a way to share data across the entire component tree. In this specific case, it was used for injecting dependencies into the project.

Go to the ``/src/context/Dependencies.ts`` file and append the new Comparator factory to the list of available factories

```ts
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
        },
        {
            name: "Chebyshev", // <--- The name for the dropdown distance-measure selector
            factory: () => new ChebyshevComparatorFactory()
        }
    ]
}
```

Now you should be good to go! Simply select the Chebyshev distance-measure from the dropdown distance-measure selector and run the comparison.

# References
[1] M. L. Larrea and D. K. Urribarri, “A visualization technique to assist in the comparison of large meteorological datasets”, Computers & Graphics, vol. 104, pp. 1-10, 2022, doi: 10.1016/j.cag.2022.02.011.
