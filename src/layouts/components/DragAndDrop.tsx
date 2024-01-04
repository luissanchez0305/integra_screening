"use client";

import { useRef, useState } from "react";
import readXlsxFile from 'read-excel-file'

export default function DragAndDrop({
  label,
}: {
  label: string;
}) {
  const [status, setStatus] = useState<string>();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);

  function addFile(target: any) {
    if (target.files && target.files[0]) {
      const { name } = target.files[0];
      const ext = name.substring(name.lastIndexOf('.'));
      if(!ext.includes('.xlsx') && !ext.includes('.xls')){
        setStatus('El archivo no es un Excel');
        setTimeout(()=>{setStatus('')}, 10000);
        return;
      }
      for (let i = 0; i < target.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, target.files[i]]);
      }
    }
  }

  function handleChange(e: any) {
    e.preventDefault();
    addFile(e.target);
  }

  async function handleSubmitFile(e: any) {
    if (files.length === 0) {
      // no file has been submitted
    } else {
      // write submit logic here
      console.log(files);
      for(const file of files){
        const excel = await readXlsxFile(file);
        for(const row of excel){
          console.log('row', row);
        }
      }
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFile(e.dataTransfer);
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className={`${
          dragActive ? "bg-blue-400" : "bg-blue-100"
        }  p-4 w-1/2 rounded-lg  min-h-[10rem] text-center flex flex-col items-center justify-center`}
        onDragEnter={handleDragEnter}
        onSubmit={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >

       <input
        placeholder="fileInput"
        className="hidden"
        ref={inputRef}
        type="file"
        multiple={true}
        onChange={handleChange}
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
      />

      <p>
        <span
          className="font-bold text-blue-600 cursor-pointer"
          onClick={openFileExplorer}
        >
          <u>{label}</u>
        </span>{" "}
      </p>

      <div className="flex flex-col items-center p-3">
          {files.map((file: any, idx: any) => (
            <div key={idx} className="flex flex-row space-x-5">
              <span>{file.name}</span>
              <span
                className="text-red-500 cursor-pointer"
                onClick={() => removeFile(file.name, idx)}
              >
                Quitar
              </span>
            </div>
          ))}
      </div>

      <div className="flex flex-col items-center p-3">
        {status}
      </div>

      {
      files.length ?
        <button
          className="bg-black rounded-lg p-2 mt-3 w-auto"
          onClick={handleSubmitFile}
        >
          <span className="p-2 text-white">Submit</span>
        </button>
        : null
      }
      </form>
    </div>
  );
}
