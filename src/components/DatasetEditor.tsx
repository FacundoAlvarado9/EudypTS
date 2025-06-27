import { useState } from "react";
import type { Dataset } from "../types/Dataset";
import parseCSVFile from "../utils/csvParser";
import FileUploader from "./FileUploader";
import DataTable from "./DataTable";

type DatasetEditorProps = {
    onDatasetChange : (dataset : Dataset) => void;
}

export default function DatasetEditor({ onDatasetChange } : DatasetEditorProps){

    const [parsedData, setParsedData] = useState<Array<Array<number>> | null>(null);
    const [parsedHeaders, setParsedHeaders] = useState<Array<(number | string)> | null>(null);

    /* const [dataset, setDataset] = useState<Dataset | null>(null);

    useEffect(() => {
        if(dataset){
            onDatasetChange(dataset);
        }        
    }, [dataset]); */

    const handleFileChange = async (file : File | null) => {
        if (file){
            try {
                const parsedData = await parseCSVFile(file) as { data: object[] };
                const headers = Object.keys(parsedData.data[0]);
                const data = parsedData.data.map(obj => Object.values(obj));
                setParsedHeaders(headers);
                setParsedData(data);
                //setDataset({headers: headers, data: data});
            } catch (error) {
                console.log(error);
            }            
        }
    }

    const onDataChange = (headers : Array<(number | string)>, data : Array<Array<number>>) => {        
        onDatasetChange({ headers: headers, data: data } as Dataset);
    }

    return (        
        <>        
        <FileUploader onFileChange={handleFileChange}/>
        {parsedData && parsedHeaders && (<>
            <DataTable headers={parsedHeaders} data={parsedData} onChange={onDataChange} />
        </>)}
        </>
    )
}