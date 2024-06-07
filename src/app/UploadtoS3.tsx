import React, { useRef } from "react";
import S3FileUpload from "react-s3";
import "./index.css";

interface UploadtoS3Props {
  files: File[];
  onUploadSuccess?: (file: File, data: any) => void;
  onUploadError?: (file: File, error: any) => void;
}

const UploadtoS3 = (React.FC<UploadtoS3Props> = ({
  files,
  onUploadSuccess,
  onUploadError,
}) => {
  // Use environment variables for sensitive information
  const config = {
    bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME,
    dirName: "uploads",
    region: process.env.NEXT_PUBLIC_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
  };

  const handleUpload = () => {
    files.forEach((file: File) => {
      S3FileUpload.uploadFile(file, config)
        .then((data) => {
          console.log(`Upload successful: ${file.name}`, data);
          if (onUploadSuccess) onUploadSuccess(file, data);
        })
        .catch((error) => {
          console.error(`Upload error: ${file.name}`, error);
          if (onUploadError) onUploadError(file, error);
        });
    });
  };

  return (
    <div>
      <button
        title="Upload to S3"
        type="button"
        className="button button-upload"
        onClick={handleUpload}
        disabled={files.length === 0}
      >
        Upload to S3
      </button>
    </div>
  );
});

export default UploadtoS3;
