import {Select} from "./Select";
import React, {useEffect, useState} from "react";
import {BASE_OPTION} from "../consts";
import {MyInput} from "./Input";

interface IProps {
    categoryOptions: { name: string; id: string}[]
}

export const CreateTab = ({ categoryOptions }: IProps) => {
    const [state, setState] = useState({ count: 5, width: 150, height: 150, selectedCategory: BASE_OPTION, gap: 10, columns: 5 })
    const [isButtonDisabled, setButtonDisabled] = useState(false)
    const hasEmptyParam = !state.width || !state.height || !state.count

    useEffect(() => {
        const listener = (event) => {
            if (event.data.pluginMessage.type === 'operation-finished') {
                setButtonDisabled(false)
            }
        }
        window.addEventListener('message', listener)

        return () => window.removeEventListener('message', listener)
    }, [])

    const onChangeInputHandler = (e: any) => {
        setState((prev) => ({ ...prev, [e.target.name]: Number.parseInt(e.target.value) || 0}))
    }

    const onSetOptionClick = (option: {id: string; name: string}) => {
        setState((prev) => ({...prev, selectedCategory: option }))
    }

    const onCreate = () => {
        setButtonDisabled(true)
        parent.postMessage({ pluginMessage: { type: "create-pictures", state } }, "*");
    };

    return (
        <>
            <div>
                <div style={{display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box'}}>
                    <span className="input-label">Category</span>
                    <Select optionsList={categoryOptions} onSetOptionClick={onSetOptionClick} selectedOption={state.selectedCategory}/>
                </div>
                <div style={{display: 'flex', gap: 10, width: '100%', justifyContent: 'space-between', marginTop: 5}}>
                    <MyInput name="count" label="Count" value={state.count} onChange={onChangeInputHandler} />
                    <MyInput name="width" label="Width" value={state.width} onChange={onChangeInputHandler} />
                    <MyInput name="height" label="Height" value={state.height} onChange={onChangeInputHandler} />
                </div>
                <div style={{display: 'flex', gap: 10, width: '100%', justifyContent: 'space-between', marginTop: 5}}>
                    <MyInput name="columns" label="Columns" value={state.columns} onChange={onChangeInputHandler} />
                    <MyInput name="gap" label="Gap" value={state.gap} onChange={onChangeInputHandler} />
                </div>
            </div>
            <button disabled={isButtonDisabled || hasEmptyParam} className="brand" onClick={onCreate}>Create</button>
        </>
    )
}