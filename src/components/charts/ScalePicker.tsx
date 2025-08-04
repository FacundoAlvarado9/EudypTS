import Dropdown from "../Dropdown";

type Scale = {
    name : string;
    scale : Array<string>
}

type ScalePickerProps = {
    scales : Scale[];
    selectId : string;
    onChange : (optionId : string) => void;
}

export default function ScalePicker({scales, selectId, onChange} : ScalePickerProps) {
    return(<>    
        <Dropdown options={scales.map((scale, index) => ({ id: index.toString(), label: scale.name }))} onChange={onChange} id={selectId}/>
    </>);
}