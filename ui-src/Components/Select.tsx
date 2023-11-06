import React, {FC, useEffect, useRef} from "react";
import {useState} from "react";
import {IOption} from "../Models/IOption";

interface IProps {
    optionsList: IOption[];
    selectedOption: IOption;
    onSetOptionClick: (o: IOption) => void;
}

export const Select: FC<IProps> = ({ optionsList, selectedOption, onSetOptionClick }) => {
    const selectRef = useRef(null);
    const [showOptionList, setOptionList] = useState(false);
    const onSelectToggle = () => setOptionList(prev => !prev)
    const handler = (option: IOption) => () => {
        onSetOptionClick(option)
        onSelectToggle()
    }

    const closeOnClickOutside = (e: any) => {
        if (!e.target.id.includes("picked-option") && !e.target.id.includes("select-option")) {
            setOptionList(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeOnClickOutside);
        return () =>  document.removeEventListener("mousedown", closeOnClickOutside);
    }, [])

    return (
        <div className="custom-select-container">
            <div
                className={showOptionList ? "selected-text active" : "selected-text"}
                onClick={onSelectToggle}
                id={`picked-option-${selectedOption.name}`}
            >
                {selectedOption.name}
            </div>
            {showOptionList && (
                <ul className="select-options">
                    {optionsList.map(option => {
                        return (
                            <li
                                className={`custom-select-option ${option.id === selectedOption.id ?'selected-option' : ''}`}
                                data-name={option.name}
                                id={`select-option-${option.name}`}
                                key={option.id}
                                onClick={handler(option)}
                            >
                                {option.name}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    )
}
