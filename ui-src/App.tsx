import React, {useEffect, useRef, useState} from "react";
import logoPng from "./glassesDown.png";
import "./App.css";
import { MyInput } from "./Components/Input";
import {useDropzone} from "react-dropzone";
import {Select} from "./Components/Select";
import {IOption} from "./Models/IOption";

const description:Record<string, string> = {
    DROP: 'Select nodes to fill, then select files on your pc, that\'s all',
    FILL: 'Select nodes and we\'ll fill it with our random pictures',
    CREATE: 'We\'ll just create picked amount random pictures for you'
}

const tabs = [{id: 'DROP', name: 'Drop files'}, {id: "FILL", name: "Fill elems" }, {id: "CREATE", name: 'Create'}]
const baseOption = { name: 'Random', id: 'Random' }

function App() {
    const [state, setState] = useState({ count: 5, width: 150, height: 150, selectedCategory: baseOption })
    const [categoryOptions, setCategoryOptions] = useState<IOption[]>([])
    const [selectedTabId, setSelectedTabId] = useState(tabs[0].id)
    const isFillTab = selectedTabId === 'FILL'
    const isCreateTab = selectedTabId === 'CREATE'
    const isDrop = selectedTabId === 'DROP'

    const getCategories = async () => {
      const resp = await fetch('https://pepavpn.ru:4006/getCategories')
      const body = await resp.json()
      setCategoryOptions([ baseOption, ...body.categories])
    }

    useEffect(() => {
        getCategories()
    }, [])

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles, other) => {
            window.parent.postMessage({
                pluginDrop: {
                    clientX: 0,
                    clientY: 0,
                    files: acceptedFiles,
                    dropMetadata: { some: "1" }
                }
            }, '*');

        },
        accept: {
            'image/*': ['.jpeg', '.png']
        }
    });

    const onChangeInputHandler = (e: any) => {
    setState((prev) => ({ ...prev, [e.target.name]: Number.parseInt(e.target.value) || 0}))
    }

    const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: "create-pictures", state } }, "*");
    };

    const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
    };

    const onFill = () => {
    parent.postMessage({ pluginMessage: { type: 'fill', category: state.selectedCategory }}, "*")
    }

    const onSetOptionClick = (option: {id: string; name: string}) => {
      setState((prev) => ({...prev, selectedCategory: option }))
    }

    return (
    <div className="main">
    <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10, width: '100%' }}>
      <div style={{  display: "flex", width: "100%", alignItems: "stretch"}}>
        {tabs.map(({id, name}) => (
          <div onClick={() => setSelectedTabId(id)} className={`tab-item ${id === selectedTabId && 'tab-selected'}`}>{name}</div>
        ))}
      </div>
        <div className="description">
            {description[selectedTabId]}
        </div>
        {!isDrop && <div style={{display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box'}}>
          <span className="input-label">picture category</span>
          <Select optionsList={categoryOptions} onSetOptionClick={onSetOptionClick}
                  selectedOption={state.selectedCategory}/>
        </div>
        }
      { isCreateTab && (
          <div style={{display: 'flex', gap: 10, width: '100%', justifyContent: 'space-between'}}>
               <MyInput name="count" label="pictures Count" value={state.count} onChange={onChangeInputHandler} />
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 15}}>
                <span className="input-label pa">picture size</span>
              <MyInput name="width" label="width" value={state.width} onChange={onChangeInputHandler} />
              <MyInput name="height" label="height" value={state.height} onChange={onChangeInputHandler} />
              </div>
          </div>
          )}
      { isDrop && (
      <section className="dropzone-container">
          <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop or click to select files</p>
          </div>
      </section>
      )}
        </div>
      <div style={{ width: "100%"}}>
          { isCreateTab && <button className="brand" onClick={onCreate}>Create</button> }
          { isFillTab && <button className="brand" onClick={onFill}>Fill</button> }
      </div>

    </div>
    );
}

export default App;
