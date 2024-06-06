"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import "./index.css";

interface DropzoneProps {
  className?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    console.log("Removed all files");
  };

  const handleSubmit = () => {
    console.log("submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="clio-title">Clio Enablement sent you this request</h2>
          <h3>Clio Data Transfer</h3>
          <div className="drag-drop-area">
            <ArrowUpTrayIcon className="w-5 h-5 fill-current " />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4">
          <h2 className="title text-3xl font-semibold">Preview</h2>
          <button
            type="button"
            onClick={removeAll}
            className="button button-remove"
          >
            Remove all files
          </button>
          <button
            title="upload to s3"
            type="submit"
            className="button button-upload"
          >
            Upload to S3
          </button>
        </div>

        {/* Accepted files */}
        <div>
          <h3 className="title">Accepted Files</h3>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
            {files.map((file) => (
              <li
                key={file.name}
                className="relative h-32 rounded-md shadow-lg"
              >
                <Image
                  src={file.preview}
                  alt={file.name}
                  width={100}
                  height={100}
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                  className="h-full w-full object-contain rounded-md"
                />

                <button
                  title="Remove file"
                  type="button"
                  className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                  onClick={() => removeFile(file.name)}
                >
                  <XMarkIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                </button>
                <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                  {file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Rejected Files */}
        <h3 className="title ">Rejected Files</h3>
        {/* <ul className="mt-6 flex flex-col">
          {rejected.map(({ file, errors }) => (
            <li key={file.name} className="flex items-start justify-between">
              <div>
                <p className="mt-2 text-neutral-500 text-sm font-medium">
                  {file.name}
                </p>
                <ul className="text-[12px] text-red-400">
                  {errors.map((error) => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                onClick={() => removeRejected(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul> */}
      </section>
    </form>
  );
};

export default Dropzone;
