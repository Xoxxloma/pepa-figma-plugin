import React, {useEffect} from "react";
import {useDropzone} from "react-dropzone";
import {Checkbox} from "./checkbox/checkbox";

const shuffle = <T,>(array: T[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const DropTab = () => {
    const [withShuffle, setWithSuffle] = React.useState(false)
    const [dropzoneDisabled, setDropzoneDisabled] = React.useState(true)

    useEffect(() => {
        parent.postMessage({ pluginMessage: { type: "check-selections", } }, "*" )
    }, [])

    useEffect(() => {
        const listener = (event) => {
            if (event.data.pluginMessage.type === 'selection-change') {
                setDropzoneDisabled(!event.data.pluginMessage.count)
            }
        }
        window.addEventListener('message', listener)

        return () => window.removeEventListener('message', listener)
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: (acceptedFiles, other) => {
            let files = acceptedFiles
            if (withShuffle) {
                files = shuffle(files)
            }
            window.parent.postMessage({
                pluginDrop: {
                    clientX: 0,
                    clientY: 0,
                    files: files,
                    dropMetadata: { some: "1" }
                }
            }, '*');

        },
        accept: {
            'image/*': ['.jpeg', '.png']
        }
    });

    return (
        <section className="dropzone-container">
            <div {...getRootProps({className: `dropzone${dropzoneDisabled ? ' disabled' : ''} `})}>
                <input {...getInputProps({disabled : dropzoneDisabled })} />
                {dropzoneDisabled ? <p>Select at least 1 node to fill</p> : isDragActive ? <p>Allright, listen<br />just drop it</p> : <p>Drag 'n' drop or<br /> click to select files</p>}
            </div>
            <Checkbox onChange={setWithSuffle} checked={withShuffle} label="Shuffle pictures" />
        </section>
    )
}
