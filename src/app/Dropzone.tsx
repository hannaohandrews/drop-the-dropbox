"use client";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import "./index.css";
import { text } from "stream/consumers";

interface DropzoneProps {
  className?: string;
}

interface PreviewFile extends File {
  name: string;
  preview: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ className }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ) as PreviewFile[];
      setFiles((previousFiles) => [...previousFiles, ...newFiles]);
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    setRejectedFiles(fileRejections);
    console.log("Rejected files:", fileRejections);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "image/*": [".png", ".gif", ".jpg", ".jpeg"],
    },
    maxFiles: 1024 * 1000,
  });

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejectedFiles([]);
    console.log("Removed all files");
  };

  const handleSubmit = () => {
    console.log("submitted");
  };

  const removeRejectedFile = (name: string) => {
    setRejectedFiles([]);
    console.log("Removed rejected files");
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
            <button
              title="upload to s3"
              type="submit"
              className="button button-upload"
            >
              Upload to S3
            </button>
          </div>
        </div>

        {/* Accepted files */}
        <div className="flex flex-col items-center justify-center gap-4 ">
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

        {/* Rejected Files */}
        <h3 className="title ">Rejected Files</h3>
        <ul className="mt-6 flex flex-col">
          {rejectedFiles.map(({ file, errors }) => (
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
                onClick={() => removeRejectedFile(file.name)}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </form>
  );
};

export default Dropzone;
