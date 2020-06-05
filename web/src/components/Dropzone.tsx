import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./styles.css";

interface DropzoneProps {
  onImageUploaded: (image: File) => void;
}

const Dropzone = ({ onImageUploaded }: DropzoneProps) => {
  const [selectedImage, setSelectedImage] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileURL = URL.createObjectURL(file);
      setSelectedImage(fileURL);
      onImageUploaded(file);
    },
    [onImageUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedImage ? (
        <img src={selectedImage} alt="Point Thumb" />
      ) : (
        <p>
          <FiUpload />
          Image do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
