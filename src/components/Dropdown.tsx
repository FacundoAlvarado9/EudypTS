type Option = {
    id : string;
    label : string;
}

type DropdownProps = {
    id : string;
    onChange : (optionId : string) => void;
    options : Option[];
    value?: string;
}

export default function Dropdown({id, onChange, options, value} : DropdownProps){
    return(<>
    <select id={id} value={value ? value : undefined} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
        ))}
    </select>
    </>);
}