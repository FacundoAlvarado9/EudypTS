import { useCallback, useEffect, useRef, useState } from 'react';
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import type { CellChange } from 'handsontable/common';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import type { Header, Row, TableData } from '../types/Dataset';

registerAllModules();

type DataTableProps = {
    dataset : TableData;
    onChange : (dataset : TableData) => void;
}

export default function DataTable({dataset, onChange} : DataTableProps){

    const hotRef = useRef<HotTableRef>(null);

    const [auxData, setAuxData] = useState<Array<Row> | null>(null);
    const [auxHeaders, setAuxHeaders] = useState<Array<Header> | null>(null);

    useEffect(() => {
        populateTable(dataset);
    }, [dataset]);

    useEffect(() => {
        if(auxData && auxHeaders){
            onChange({headers: auxHeaders, data: auxData} as TableData);
        }        
    }, [auxData, auxHeaders]);

    const populateTable = (dataset : TableData) => {
        if(dataset.headers && dataset.data){
            setAuxData(structuredClone(dataset.data));
            setAuxHeaders(structuredClone(dataset.headers));
        }        
    }

    const propagateChange = useCallback(() => {
        const hotInstance = hotRef?.current?.hotInstance;
        if (hotInstance){          
          const newData = hotInstance.getData();
          setAuxData([...newData]);
        }
    }, [onChange]);

    const onTableChange = useCallback((changes : CellChange[] | null) => {
        if(changes){
            propagateChange();
        }
    }, [propagateChange]);

    const onRemoveCol = useCallback((_index : number, amount : number) => {
        if(amount > 0){
            propagateChange();
        }
    },[propagateChange]);

    const onRemoveRow = useCallback((_index : number, amount : number) => {
        if(amount > 0){
            propagateChange();
        }
    }, [propagateChange]);

    return (<>
    <div className="ht-theme-main-dark-auto" style={{overflow: 'scroll', height:'50em'}} >
        <HotTable
        ref={hotRef}
        data={auxData as Array<Row>}
        colHeaders={auxHeaders as Array<string>}
        rowHeaders={true}
        contextMenu={["row_above","row_below","remove_col"]}
        columnSorting={false}
        afterChange={onTableChange}
        afterRemoveCol={onRemoveCol} 
        afterRemoveRow={onRemoveRow}
        renderAllRows={false}
        licenseKey="non-commercial-and-evaluation" />
    </div>
    
    </>)
}