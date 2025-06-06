import style from './Input.module.css'
import React, { forwardRef } from 'react'

const InputPreset = forwardRef(({ type, placeholder, id, label }, ref) => {
    return (
        <div className={style.inputContainer}>
            <p className={style.label}>{label}</p>
            <input
                className={style.inputPreset}
                id={id}
                ref={ref}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
});

export default InputPreset;
