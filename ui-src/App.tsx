import React, {useEffect, useState} from "react";
import "./App.css";
import {IOption} from "./Models/IOption";
import {FillTab} from "./Components/FillTab";
import {CreateTab} from "./Components/CreateTab";
import {DropTab} from "./Components/DropTab";

const description:Record<string, string> = {
    DROP: 'Select nodes and fill it by your files',
    FILL: 'Select nodes and fill it by our random pictures',
    CREATE: 'Create picked amount random pictures'
}

const tabs = [{id: 'DROP', name: 'Drop'}, {id: "FILL", name: "Fill" }, {id: "CREATE", name: 'Create'}]
const baseOption = { name: 'Random', id: 'Random' }

function App() {
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


    return (
    <div className="main">
        <div style={{display: "flex", flexDirection: "column", flex: 1, gap: 10, width: '100%' }}>
          <div style={{  display: "flex", width: "100%", alignItems: "stretch"}}>
            {tabs.map(({id, name}) => (
              <div onClick={() => setSelectedTabId(id)} className={`tab-item ${id === selectedTabId && 'tab-selected'}`}>{name}</div>
            ))}
          </div>
        <div className="description">{description[selectedTabId]}</div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                {isFillTab && <FillTab categoryOptions={categoryOptions} />}
                {isCreateTab && <CreateTab categoryOptions={categoryOptions} />}
                {isDrop && <DropTab />}
            </div>
        </div>
    </div>
    );
}



export default App;
