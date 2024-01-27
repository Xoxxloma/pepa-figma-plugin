import React from "react";
import {useDropzone} from "react-dropzone";


export const DropTab = () => {
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

    return (
        <section className="dropzone-container">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop or<br /> click to select files</p>
            </div>
        </section>
    )
}