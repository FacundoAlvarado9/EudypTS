import type { TableData } from "../../types/Dataset";

export class TableDataValidator {
    public static validate(reference : TableData, refTimestampColumnIndex : number, target : TableData, targetTimestampColumnIndex : number) : void {
        validateReferences(reference, target);
        validatePoints(reference, refTimestampColumnIndex, "reference");
        validatePoints(target, targetTimestampColumnIndex, "target");
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

function validatePoints(table : TableData, columnIndex : number, tableName : string) : void {
    validateParseableIndexColumn(table, columnIndex, tableName);
    validateNumericPoints(table, columnIndex, tableName);
}

function validateParseableIndexColumn(table : TableData, columnIndex : number, tableName : string) : void{
    table.data.forEach((row, rowIndex) => {
        row.forEach((value, valueIndex) => {
            if((valueIndex == columnIndex) && (isNaN(Date.parse(value)))){
                throw new Error(tableName+" has a non-parseable timestamp on the selected timestamp column at row "+(rowIndex+1));
            }
        });
    });
}

function validateNumericPoints(table : TableData, columnIndex : number, tableName : string) : void {
    table.data.forEach((row, rowIndex) => {
        row.forEach((value, valueIndex) => {
            if((valueIndex != columnIndex) && (isNaN(Number(value)))){
                throw new Error(tableName+" table has non-numeric values at row "+ (rowIndex+1) + ", column  "+(table.headers[valueIndex]));
            }
            if(value == ""){
                throw new Error("Cell at row "+(rowIndex+1)+", column " +(table.headers[valueIndex])+" is empty.");
            }
        });
    });
}