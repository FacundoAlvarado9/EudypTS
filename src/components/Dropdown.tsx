type Option = {
    id : string;
    label : string;
}

type DropdownProps = {
    id : string;
    onChange : (optionId : string) => void;
    options : Option[];
}

export default function Dropdown({
    id,
    onChange,
    options,
} : DropdownProps){
    return(<>
    <select id={id} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
        ))}
    </select>
    </>);
}