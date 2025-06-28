import { useState } from "react";
import type { Dataset } from "../types/Dataset";
import parseCSVFile from "../utils/csvParser";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";

type DatasetEditorProps = {
    onDatasetChange : (dataset : Dataset) => void;
}

export default function DatasetEditor({ onDatasetChange } : DatasetEditorProps){

    const [parsedDataset, setParsedDataset] = useState<Dataset | null>(null);

    const handleFileChange = async (file : File | null) => {
        if (file){
            try {
                const parsedData = await parseCSVFile(file) as { data: object[] };
                const headers = Object.keys(parsedData.data[0]);
                const data = parsedData.data.map(obj => Object.values(obj));
                setParsedDataset({headers: headers, data: data} as Dataset);
            } catch (error) {
                console.log(error);
            }            
        }
    }

    const onDataChange = (dataset : Dataset) => {        
        onDatasetChange(dataset as Dataset);
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