# Time-series comparison

Web App that aims to compare two time-series using a Dynamic-Time-Warping-based technique developed at the Universidad Nacioanl del Sur in Argentina.

## Functionalities
The user should be able to upload their reference and target time-series in .csv format and edit them freely on a data-table. When ready, the user should be able to trigger the comparison after selecting an available distance measure. During comparison, the validity of the time-series will be checked. After validation, the user should be able to visualize the output of the comparison.

## Current status
Currently under development. A current un-finished version is deployed on https://time-series-comparison.vercel.app/. File upload, parsing, and editing are the working pieces as of today.

## Project structure
This is a React + Typescript project built with Vite. As such, most of the relevant code can be found in the /src directory.

```
time-series-comparison
├── src
│   ├── /components
|   ├── /types
│   ├── /utils
|   ├── App.tsx
|   └── ...
```

### Components
Components are the main building blocks of React-based applications. They are reusable UI elements that manage their own internal state and logic.

```
src
├── /components
│   ├── FileUploader.tsx
|   ├── DataTable.tsx
│   ├── DatasetEditor.tsx
|- App.tsx
```

The "main" component, so to say, would be the App.tsx component. It will render two DatasetEditor components. Each DatasetEditor component contains a FileUploader component, to upload the files and manage their parsing, and a DataTable component, which implements a Handsontable data-table (3rd-party library). CSV Parsing is carried out by the utility function parseCSVFile, to be found in the /utils directory, this utility function implements a 3rd-party library called Papaparse.
