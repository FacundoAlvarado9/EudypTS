import './error-alert.css';

type ErrorAlertProps = {
    message : string;
    onClose : () => void;
}

export default function ErrorAlert({message, onClose} : ErrorAlertProps){
    return (
        <div className='error-bar'>
            <p>Error: {message}</p>
            <p onClick={_e => {onClose()}} className='underlineOnHover'>[X]</p>
        </div>
    );
}