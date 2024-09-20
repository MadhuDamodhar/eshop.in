import React, { useState, useRef } from 'react';
import './ImageUploader.css';
import productService from '../Service/productService';
import Toastify from '../ToastNotify/Toastify';
const ImageUploader = ({ id }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorNotification, setErrorNotification] = useState(null);
  const imageRef = useRef(null);

  const [imageDetails, setImageDetails] = useState({
    product_image: ""
  });

  console.log(imageDetails);

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
    const droppedFile = e.dataTransfer.files[0];

    // Validate if file is an image
    if (!droppedFile || droppedFile.type.split('/')[0] !== 'image') {
      setErrorNotification('Not an image File');
      setDragOver(false);
      return setTimeout(() => setErrorNotification(null), 3000);
    }

    setFile(droppedFile);
    setImageDetails({
      ...imageDetails,
      product_image: droppedFile.name,
    });
    setDragOver(false);
  };

  const handleAddImage = (e) => {
    const addedFile = imageRef.current.files[0];

    // Validate if file is an image
    if (!addedFile || addedFile.type.split('/')[0] !== 'image') {
      setErrorNotification('Not an image File');
      setFile(null);
      return setTimeout(() => setErrorNotification(null), 3000);
    }

    setFile(addedFile);
    setImageDetails({
      ...imageDetails,
      product_image: addedFile.name,
    });
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file); // Attach the image file
        formData.append('productId', imageDetails.productId); // Add product ID or other details
  
        // Upload the image
        await productService.addImageToProduct(id, formData);
  
        console.log('Image uploaded successfully');
         Toastify.showSuccessMessage("'Image uploaded successfully'")
      } catch (error) {
        console.error('Error uploading image:', error);
        Toastify.showErrorMessage("'Error uploading image'")
      }
    }
  };
  
  const handleCancelUpload = (e) => {
    e.preventDefault();
    setFile(null);
    setImageDetails({
      ...imageDetails,
      product_image: '',
    });
  };

  let dragOverClass = dragOver ? 'display-box drag-over' : 'display-box';
  let uploadText = file ? (
    <div>
      <h4>{file.name}</h4>
      <button className="cancel-upload-button btn btn-warning" onClick={handleCancelUpload}>
        Cancel
      </button>
      <button className="upload-button btn btn-primary" onClick={handleUploadImage}>
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
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onChange={handleAddImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
