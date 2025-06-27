
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { registerAllModules } from 'handsontable/registry';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CellChange } from 'handsontable/common';

registerAllModules();

type DataTableProps = {
    headers: Array<(number | string)>;
    data : Array<Array<number>>;
    onChange : (headers : Array<(number | string)>, data : Array<Array<number>>) => void;
}

export default function DataTable({headers, data, onChange} : DataTableProps){

    const hotRef = useRef<HotTableRef>(null);

    const [auxData, setAuxData] = useState<Array<Array<number>> | null>(null);
    const [auxHeaders, setAuxHeaders] = useState<Array<(number | string)> | null>(null);

    useEffect(() => {
        populateTable(headers, data);
    }, [headers, data]);

    useEffect(() => {
        if(auxData && auxHeaders){
            onChange(auxHeaders, auxData);
        }        
    }, [auxData, auxHeaders]);

    const populateTable = (headers : Array<(number | string)>, data : Array<Array<number>>) => {
        if(data && headers){
            setAuxData(structuredClone(data));
            setAuxHeaders(structuredClone(headers));
        }        
    }

    const propagateChange = useCallback(() => {
        const hotInstance = hotRef?.current?.hotInstance;
        if (hotInstance){          
          const newData = hotInstance.getData();
          setAuxData(newData);
        }
    }, [onChange]);

    const onTableChange = useCallback((changes : CellChange[] | null) => {
        if(changes){
            propagateChange();
        }
    }, [propagateChange]);

    const onRemoveCol = useCallback((amount : number) => {
        if(amount > 0){
            propagateChange();
        }
    },[propagateChange]);

    const onRemoveRow = useCallback((amount : number) => {
        if(amount > 0){
            propagateChange();
        }
    }, [propagateChange]);

    return (<>
    <div className="ht-theme-main-dark-auto" style={{overflow: 'scroll', height:'50em'}} >
        <HotTable
        ref={hotRef}
        data={auxData as Array<Array<number>>}
        colHeaders={auxHeaders as Array<string>}
        rowHeaders={true}
        contextMenu={true}
        columnSorting={false}
        afterChange={onTableChange}
        afterRemoveCol={onRemoveCol} 
        afterRemoveRow={onRemoveRow}
        renderAllRows={false}
        licenseKey="non-commercial-and-evaluation" />
    </div>
    
    </>)
}