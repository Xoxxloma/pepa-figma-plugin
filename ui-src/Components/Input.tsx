import React, {FC} from 'react';

interface IProps {
  value: string | number;
  onChange: (e: any) => void;
  label: string;
  name: string
}

export const MyInput:FC<IProps> = ({ value, onChange, label, name}) => {
  return (
    <div className="input-container">
      <label htmlFor="input" className="input-label">{label}</label>
      <input id="input" type="number" min="1" name={name} value={value || ''} onChange={onChange} />
    </div>
  )
}
