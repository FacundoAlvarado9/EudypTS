import { useCallback, useEffect, useRef } from 'react';
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import type { CellChange } from 'handsontable/common';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import type { Header, TableData } from '../types/Dataset';

registerAllModules();

type DataTableProps = {
    dataset : TableData;
    onChange : (dataset : TableData) => void;
    dataLoadCount : number;
}

export default function DataTable({dataset, onChange, dataLoadCount} : DataTableProps){

    const hotRef = useRef<HotTableRef>(null);
    const headersRef = useRef<Header[]>(null)

    useEffect(() => {
        headersRef.current = structuredClone(dataset.headers);
        hotRef.current?.hotInstance?.updateSettings({
            data: structuredClone(dataset.data),
            colHeaders: structuredClone(dataset.headers)
        });
    }, [dataLoadCount]);

    const getHotRefData = () => {
        return hotRef.current?.hotInstance?.getData();
    }

    const onTableChange = useCallback((changes : CellChange[] | null) => {
        changes?.forEach(([row, prop, _oldValue, newValue]) => {
            const dataClone = structuredClone(hotRef.current?.hotInstance?.getData())!;
            dataClone[row][Number(prop)] = newValue;
            onChange({data: dataClone, headers: headersRef.current!} as TableData);
        })
    }, []);

    const onRemoveCol = useCallback((_index : number, amount : number) => {
        if(amount > 0){
            const headersClone = structuredClone(headersRef.current!);            
            headersClone.splice(_index, amount);
            headersRef.current = headersClone;
            onChange({data: getHotRefData(), headers: headersRef.current!} as TableData);
        }
    },[]);

    const onRemoveRow = useCallback((_index : number, amount : number) => {
        if(amount > 0){
            onChange({data: getHotRefData(), headers: headersRef.current!} as TableData);
        }
    }, []);

    return (<>
    <div className="ht-theme-main-dark-auto" style={{overflow: 'scroll', height:'50em'}} >
        <HotTable
        ref={hotRef}
        rowHeaders={true}
        contextMenu={["row_above","row_below","remove_col", "remove_row"]}
        columnSorting={false}
        autoRowSize={{syncLimit: 27}}
        afterChange={onTableChange}
        afterRemoveCol={onRemoveCol} 
        afterRemoveRow={onRemoveRow}
        renderAllRows={false}
        licenseKey="non-commercial-and-evaluation" />
    </div>
    
    </>)
}