import React, {useEffect, useState} from "react";
import {BASE_OPTION} from "../consts";

interface IProps {
    categoryOptions: { name: string; id: string}[]
}

export const FillTab = ({ categoryOptions }: IProps) => {
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
        // TODO необязательно отправлять всю категорию, используется только айдишник
        parent.postMessage({ pluginMessage: { type: 'fill', category: selectedCategory }}, "*")
    }

    return (
        <>
             <div className="optionsContainer">
                 { categoryOptions.map((opt) => (
                     <div
                         className={`categoryOption__item ${selectedCategory.id === opt.id ? 'categoryOption__item_selected ' : ''}`}
                         key={opt.id}
                         onClick={() => onSetOptionClick(opt)}
                     >
                        <img style={{maxWidth: 64, height: 48, borderRadius: 6}} src={`https://pepavpn.ru:4006/covers/${opt.id}`} alt={opt.name} />
                        <div style={{ lineBreak: 'auto', textAlign: 'start'}}>{opt.name}</div>
                     </div>
                 ))}
             </div>
            <button disabled={isButtonDisabled} className="brand" onClick={onFill}>Fill</button>
        </>
    )
}