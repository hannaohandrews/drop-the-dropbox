"use client";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import "./index.css";
import UploadtoS3 from "./UploadtoS3";

interface DropzoneProps {
  className?: string;
}

interface PreviewFile extends File {
  name: string;
  preview: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ) as PreviewFile[];
      setFiles((previousFiles) => [...previousFiles, ...newFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpg", ".jpeg"],
    },
  });

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    console.log("Removed all files");
  };

  const handleSubmit = () => {
    console.log("submitted");
  };

  const handleUploadSuccess = (file: File, data: any) => {
    console.log(`File ${file.name} uploaded successfully: `, data);
  };

  const handleUploadError = (file: File, error: any) => {
    console.error(`Error uploading file ${file.name}: `, error);
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
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={removeAll}
              className="button button-remove"
            >
              Remove all files
            </button>
            <UploadtoS3
              files={files}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-4 ">
          <h3 className="title">Preview</h3>
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
                  className="button-icon"
                  onClick={() => removeFile(file.name)}
                >
                  <XMarkIcon className="icon-style" />
                </button>
                <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                  {file.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </form>
  );
};

export default Dropzone;
