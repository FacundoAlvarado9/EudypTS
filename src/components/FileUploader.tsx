import { type ChangeEvent } from "react";

type FileUploaderProps = {
    onFileChange : (file : File | null) => void;
}
export default function FileUploader({ onFileChange } : FileUploaderProps){

    const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            onFileChange(e.target.files[0]);
        }
    }

    return (
        <>
        <input type="file" accept=".csv" onChange={handleFileChange}/>
        </>
    )
}