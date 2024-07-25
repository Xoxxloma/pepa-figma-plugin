import React from 'react'
import './checkbox.css'

interface IProps {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}

export const Checkbox = ({ checked, onChange, label}: IProps) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked)
    }

    return (
        <div style={{ height: 35, display: 'flex', alignItems: 'center', gap: 8}}>
            <div>{label}</div>
            <div className="checkbox-wrapper-3">
                <input type="checkbox" id="cbx-3" checked={checked} onChange={onChangeHandler}/>
                <label htmlFor="cbx-3" className="toggle"><span/></label>
            </div>
        </div>
    )
}


