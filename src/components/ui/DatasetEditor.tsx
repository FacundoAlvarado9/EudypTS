import { useState } from "react";
import parseCSVFile from "../../utils/csvParser";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";
import type { TableData } from "../../types/TableData.types";
import DateColumnSelector from "./DateColumnSelector";

type DatasetEditorProps = {
    tableName : string; 
    table : (TableData | null);
    onDatasetChange : (dataset : TableData) => void;
    onError : (error : any) => void;
    onChangeDateColumn : (columnId : number) => void;
}

export default function DatasetEditor({ tableName, table, onDatasetChange, onError, onChangeDateColumn } : DatasetEditorProps){

    const [parsedFileCount, setParsedLoadCount] = useState<number>(0);

    const increaseParsedFileCount = () => {
        setParsedLoadCount(parsedFileCount+1);
    }

    const handleFileChange = async (file : File | null) => {
        if (file){
            try {
                const parsedData = await parseCSVFile(file) as { data: object[] };
                const headers = Object.keys(parsedData.data[0]);
                const data = parsedData.data.map(obj => Object.values(obj));
                increaseParsedFileCount();
                onDatasetChange({headers: [...headers], data: data} as TableData);
            } catch (error) {
                onError("Parsing error -  " + error);
            }
        }
    }

    return (        
        <>        
        <FileUploader onFileChange={handleFileChange}/>
        {table && (<>
            <DateColumnSelector id={tableName} table={table} onChange={onChangeDateColumn} />
            <DataTable dataset={table} onChange={onDatasetChange} dataLoadCount={parsedFileCount}/>
        </>)}
        </>
    )
}