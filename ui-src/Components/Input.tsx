import React, {FC} from 'react';

interface IProps {
  value: string | number;
  onChange: (e: any) => void;
  label: string;
  name: string
}

export const MyInput:FC<IProps> = ({ value, onChange, label, name}) => {
  return (
    <div style={{marginTop: 15, display: 'flex', flexDirection: 'column'}}>
    <input id="input" type="number" min="0" name={name} value={value} onChange={onChange} />
    <label htmlFor="input" className="input-label">{label}</label>
  </div>
  )
}
