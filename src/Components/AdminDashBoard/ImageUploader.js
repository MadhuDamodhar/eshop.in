import React, { useState, useRef } from 'react';
import './ImageUploader.css';
import productService from '../Service/productService';
import Toastify from '../ToastNotify/Toastify';

const ImageUploader = ({ id }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [errorNotification, setErrorNotification] = useState(null);
  const imageRef = useRef(null);

  const [imageDetails, setImageDetails] = useState({
    product_images: [],
  });

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Validate that all files are images
    const invalidFiles = droppedFiles.filter(
      (file) => file.type.split('/')[0] !== 'image'
    );

    if (invalidFiles.length > 0) {
      setErrorNotification('Some files are not images');
      return setTimeout(() => setErrorNotification(null), 3000);
    }

    setFiles([...files, ...droppedFiles]); // Add to existing files
    setImageDetails({
      ...imageDetails,
      product_images: [...imageDetails.product_images, ...droppedFiles.map((file) => file.name)],
    });
    setDragOver(false);
  };

  const handleAddImages = (e) => {
    const addedFiles = Array.from(imageRef.current.files);

    // Validate that all files are images
    const invalidFiles = addedFiles.filter(
      (file) => file.type.split('/')[0] !== 'image'
    );

    if (invalidFiles.length > 0) {
      setErrorNotification('Some files are not images');
      return setTimeout(() => setErrorNotification(null), 3000);
    }

    setFiles([...files, ...addedFiles]); // Add to existing files
    setImageDetails({
      ...imageDetails,
      product_images: [...imageDetails.product_images, ...addedFiles.map((file) => file.name)],
    });
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();
    if (files.length > 0) {
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('product_images', file)); // Add all files

        formData.append('productId', id); // Add product ID

        // Upload the images
        await productService.addImagesToProduct(id, formData);

        console.log('Images uploaded successfully');
        Toastify.showSuccessMessage('Images uploaded successfully');
      } catch (error) {
        console.error('Error uploading images:', error);
        Toastify.showErrorMessage('Error uploading images');
      }
    }
  };

  const handleCancelUpload = (e) => {
    e.preventDefault();
    setFiles([]);
    setImageDetails({
      ...imageDetails,
      product_images: [],
    });
  };
console.log(imageDetails);

  let dragOverClass = dragOver ? 'display-box drag-over' : 'display-box';
  let uploadText = files.length > 0 ? (
    <div>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
      <button className="cancel-upload-button btn btn-warning" onClick={handleCancelUpload}>
        Cancel
      </button>
      <button className="upload-button btn btn-primary" onClick={handleUploadImages}>
        Upload
      </button>
    </div>
  ) : (
    <div style={{ backgroundColor: 'transparent' }}>
      <h4 id="choose-file-title">Choose Files to Upload</h4>
    </div>
  );

  let errorMessage = errorNotification ? (
    <div className="error-notification">
      <p>{errorNotification}</p>
    </div>
  ) : null;

  return (
    <div className="image-uploader-wrapper">
      <div className={dragOverClass}>
        <div className="icon-text-box">
          <div className="upload-icon">
            <i className="fa fa-upload" aria-hidden="true"></i>
          </div>
          <div className="upload-text">{uploadText}</div>
          {errorMessage}
        </div>

        <div>
          <input
            type="file"
            ref={imageRef}
            id="upload-image-input"
            className="upload-image-input"
            accept="image/*"
            multiple // Allow multiple file selection
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onChange={handleAddImages}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
