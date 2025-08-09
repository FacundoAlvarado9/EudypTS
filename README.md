# Time-series comparison

Web App that aims to compare two time-series using a Dynamic-Time-Warping-based technique developed at the Universidad Nacional del Sur in Argentina.

## Functionalities
The user should be able to upload their reference and target time-series in .csv format and edit them freely on a data-table. When ready, the user should be able to trigger the comparison after selecting an available distance measure (euclidean, manhattan, Karl-Pearson). During comparison, the validity of the time-series will be checked. After validation, the user should be able to visualize the output of the comparison.

## Current status
Currently under development. A current un-finished version is deployed on https://time-series-comparison.vercel.app/.

## Project overview
This is a React + Typescript project built with Vite.

## Project structure
The main component of this application is the App component. Dataset upload, parsing and editing is managed by the DatasetEditor component. There, CSV-parsing is done with the PapaParse library and the Handsontable library is used for the data-table where the user edits the datasets.

Each dataset is kept on a state variable in the main app component. Time-series comparison logic is found in the useTSCompare custom React-Hook. A custom React-Hook offers a way to encapsulate React logic to be used in other components without the need to render any UI. The purpose of the useTSCompare custom-hook is to encapsulate the usage of the TSCompare library.

### Usage of the TSCompare library
The TSCompare library implements the comparison calculations for the DTW-based Time-Series comparison technique. The TSComparator interface ofers a _compare_ method for comparing two TimeSeries objects. Each TimeSeries is just an ordered array of N-Dimensional-Points (represented as a simple array of numbers). It is assumed that the N-Dimensional-Points are ordered temporally.

The TSCompare interface is first implemented by an abstract class AbstractTSComparator, which provides the specific calculations and leaves the abstract function _distance_ not implemented. This distance function is used to calculate the distance between two N-Dimensional-Points. Each specific implementation EuclideanComparator, ManhattanComparator, and KarlPearsonComparator implement the specific Euclidean, Manhattan, and Karl-Pearson distance measures, respectively.

#### Adapter Pattern
Datasets uploaded by the user are kept as arrays of Rows, which in turn are simply arrays of strings. In order to compare them using the TSCompare library, the adapter pattern is used. The adapter pattern is a design pattern that allows objects with incompatible interfaces to collaborate (Refactoring Guru).

Each row is converted to an N-Dimensional-Point (after checking if its value is numeric, of course). For the purpose of _ordering_ the new N-Dimensional-Points, the user can select a _Timestamp column_, that is, a column which contains a timestamp. As of this point of development, valid timestamps are those supported by the built-in Date.parse() of Javascript. If no timestamp column is selected, then the order of the rows in the data-table is used as ordering.

### Web-workers for comparison computation
Since the aforementioned DTW-based comparison technique can be compute-intensive, Web Workers are used for running the comparison. The Factory Pattern is used for instantiating web workers. There is one factory class for each Comparator class, that is, one for EuclideanComparator, one for ManhattanComparator, and one for KarlPearsonComparator.

### Charts
The visualizations generated aim to be the same ones as the _Detailed View_ mentioned in the technique's article.

Apache ECharts was used for generating the visualizations. Reasons for this decisions were mainly: An long list of examples provided with the documentation; broad industry use, which means discussion of common problems; extensive options for extension and customization (e.g. extensive configuration options, custom color-scales, custom tooltip configuration).

## Sources
Urribarri, K., Larrea, M. (2022) A visualization technique to assist in the comparison of large meteorological datasets. _Computers & Graphics, Volume 104_, pages 1-10. https://doi.org/10.1016/j.cag.2022.02.011 