import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FiX, FiCheck, FiRotateCw } from 'react-icons/fi';
import getCroppedImg from '../utils/cropImage';

const ImageCropper = ({ image, onCropComplete, onCancel, aspectRatio: initialAspectRatio = 16 / 9 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(initialAspectRatio);
  const [originalAspect, setOriginalAspect] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onMediaLoaded = (mediaSize) => {
    const aspect = mediaSize.width / mediaSize.height;
    setOriginalAspect(aspect);
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) {
      alert("Please wait for the cropper to initialize.");
      return;
    }
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (!croppedImage) {
        throw new Error("Failed to generate cropped image blob.");
      }
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("Cropping error:", e);
      alert("Error cropping image. This might be due to a secure connection (CORS) issue if you're using a URL.");
    }
  };

  return (
    <div className="cropper-overlay">
      <div className="cropper-container card">
        <div className="cropper-header">
          <h3>Crop Image</h3>
          <div className="cropper-aspect-ratios">
            <button type="button" className={`aspect-btn ${aspectRatio === 16/9 ? 'active' : ''}`} onClick={() => setAspectRatio(16/9)}>16:9</button>
            <button type="button" className={`aspect-btn ${aspectRatio === 1 ? 'active' : ''}`} onClick={() => setAspectRatio(1)}>1:1</button>
            <button type="button" className={`aspect-btn ${aspectRatio === 4/3 ? 'active' : ''}`} onClick={() => setAspectRatio(4/3)}>4:3</button>
            <button type="button" className={`aspect-btn ${aspectRatio === originalAspect ? 'active' : ''}`} onClick={() => setAspectRatio(originalAspect)}>Original</button>
          </div>
          <div className="cropper-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setRotation((rotation + 90) % 360)}>
              <FiRotateCw /> Rotate
            </button>
            <button type="button" className="close-btn" onClick={onCancel}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="cropper-wrapper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
            onMediaLoaded={onMediaLoaded}
            objectFit="contain"
            showGrid={true}
          />
        </div>

        <div className="cropper-controls">
          <div className="control-group">
            <label>Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="zoom-range"
            />
          </div>
          <div className="control-group">
            <label>Shape</label>
            <input
              type="range"
              value={aspectRatio || 1}
              min={0.5}
              max={2.5}
              step={0.1}
              aria-labelledby="Shape"
              onChange={(e) => setAspectRatio(parseFloat(e.target.value))}
              className="zoom-range"
            />
          </div>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleCrop}
            disabled={!croppedAreaPixels}
          >
            <FiCheck /> Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
