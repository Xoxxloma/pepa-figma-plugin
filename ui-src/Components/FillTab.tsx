import {Select} from "./Select";
import React, {useEffect, useState} from "react";
import {BASE_OPTION} from "../consts";


export const FillTab = ({ categoryOptions }) => {
    const [isButtonDisabled, setButtonDisabled] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(BASE_OPTION)

    useEffect(() => {
        parent.postMessage({ pluginMessage: { type: "check-selections", } }, "*" )
    }, [])

    useEffect(() => {
        const listener = (event) => {
            if (event.data.pluginMessage.type === 'selection-change') {
                setButtonDisabled(!event.data.pluginMessage.count)
            }
            if (event.data.pluginMessage.type === 'operation-finished') {
                setButtonDisabled(!event.data.pluginMessage.count)
            }
        }
        window.addEventListener('message', listener)

        return () => window.removeEventListener('message', listener)
    }, [])

    const onSetOptionClick = (option: {id: string; name: string}) => {
        setSelectedCategory(option)
    }

    const onFill = () => {
        setButtonDisabled(true)
        parent.postMessage({ pluginMessage: { type: 'fill', category: selectedCategory }}, "*")
    }

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box'}}>
                <span className="input-label">Category</span>
                <Select optionsList={categoryOptions} onSetOptionClick={onSetOptionClick} selectedOption={selectedCategory}/>
            </div>
            <button disabled={isButtonDisabled} className="brand" onClick={onFill}>Fill</button>
        </>
    )
}