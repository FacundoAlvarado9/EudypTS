import type { TableData } from "../../types/Dataset";

export class TableDataValidator {
    public static validate(reference : TableData, target : TableData) : void {
        validateReferences(reference, target);
        validateNumericPoints(reference, "reference");
        validateNumericPoints(target, "target");
    }
}

function validateReferences(reference : TableData, target : TableData){
    if(reference == null){
        throw new Error("There is no reference dataset."); 
    }
    if(target == null){
        throw new Error("There is no target dataset."); 
    }
}

function validateNumericPoints(table : TableData, tableName : string) : void {
    table.data.forEach((row, rowIndex) => {
        row.forEach((value, valueIndex) => {
            if(isNaN(Number(value))){
                throw new Error(tableName+" table has non-numeric values at row "+ (rowIndex+1) + ", column  "+(table.headers[valueIndex]));
            }
            if(value == ""){
                throw new Error("Cell at row "+(rowIndex+1)+", column " +(table.headers[valueIndex])+" is empty.");
            }
        });
    });
}