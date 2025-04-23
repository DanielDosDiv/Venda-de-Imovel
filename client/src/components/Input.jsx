import style from './Input.module.css'
function InputPreset({ type, placeholder, ref, id, label, elemento}) {
    return (
        <div className={style.inputContainer}>
            <p className={style.label} >{label}</p>
            <input
                className={style.inputPreset}
                id={id}
                ref={ref}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}
export default InputPreset;