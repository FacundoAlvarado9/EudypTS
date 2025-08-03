import { useState } from "react";
import parseCSVFile from "../utils/csvParser";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";
import type { TableData } from "../types/Dataset";

type DatasetEditorProps = {
    onDatasetChange : (dataset : TableData) => void;
    onError : (error : any) => void;
}

export default function DatasetEditor({ onDatasetChange, onError } : DatasetEditorProps){

    const [parsedDataset, setParsedDataset] = useState<TableData | null>(null);

    const handleFileChange = async (file : File | null) => {
        if (file){
            try {
                const parsedData = await parseCSVFile(file) as { data: object[] };
                const headers = Object.keys(parsedData.data[0]);
                const data = parsedData.data.map(obj => Object.values(obj));
                setParsedDataset({headers: headers, data: data} as TableData);
            } catch (error) {
                onError(error);
            }            
        }
    }

    const onDataChange = (dataset : TableData) => {        
        onDatasetChange(dataset as TableData);
    }

    return (        
        <>
        <FileUploader onFileChange={handleFileChange}/>
        {parsedDataset && (<>
            <DataTable dataset={parsedDataset} onChange={onDataChange} />
        </>)}
        </>
    )
}