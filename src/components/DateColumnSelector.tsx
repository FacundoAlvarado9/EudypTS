import type { TableData } from "../types/Dataset"
import Dropdown from "./Dropdown";

type DateColumnSelectorProps = {
    id : string;
    table : TableData;
    onChange : (columnId : number) => void;
}

export default function DateColumnSelector({id, table, onChange} : DateColumnSelectorProps){
    return (<>
    {table?.headers && 
                  <Dropdown
                    options={[
                      { id: "-1", label: "No timestamp column" },
                      ...table.headers.map((header, index) => ({ id: index.toString(), label: header }))
                    ]}
                    onChange={(optionId) => onChange(parseInt(optionId))}
                    id={id}
                  />
                }
    </>);
}