import Papa from 'papaparse';

export default function parseCSVFile(file : File){
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            worker: true,
            skipEmptyLines: true,
            complete: (results) => {
                if(results.errors.length > 0){
                    reject(results.errors[0].message);
                } else{
                    resolve(results);
                }                
            },
            error: (error) => {
                reject(error.message);
            }
        });
    });
}