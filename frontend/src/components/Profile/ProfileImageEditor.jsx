import React from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import PropTypes from 'prop-types';
import 'cropperjs/dist/cropper.css';
import { Button, ButtonGroup } from '@material-ui/core';
// import { useDropzone } from 'react-dropzone';
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable react/jsx-boolean-value */

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  height: 200,
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

function ProfileImageEditor(props) {
  const {
    setImageData,
    setError,
    error,
  } = props;
  const [imageFileObj, setImageFileObj] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState('#');
  const [cropper, setCropper] = React.useState();
  const [croppedData, setCroppedData] = React.useState('#');

  React.useEffect(() => {
    if (imageFileObj !== null || undefined) {
      const reader = new FileReader();

      if (imageFileObj instanceof Blob) {
        reader.onloadend = () => {
          setImageUrl(reader.result);
        };
      }

      reader.readAsDataURL(imageFileObj);
    }
  }, [imageFileObj]);

  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      setError(false);
      setImageUrl('#');
      setCroppedData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImageFileObj(acceptedFiles[0]);
    },
  });

  const style = React.useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept,
  ]);

  const undoChanges = () => {
    setCroppedData('#');
    setImageUrl('#');
    setImageFileObj(null);
  };

  const saveChanges = () => {
    setImageData(croppedData);
  };

  return (
    <div className="questionImageForm">
      {error && <p style={{ color: 'red' }}>Must have an image!</p>}
      {
        !imageFileObj && imageUrl === '#'
          ? (
            <div>
              <div {...getRootProps({ style })}>
                <input
                  type="file"
                  {...getInputProps()}
                  aria-label="Drag and drop a picture, or click to select file"
                />
                <p>Drag n drop a picture here, or click to select file</p>
                <em>(Only *.jpeg and *.png images will be accepted)</em>
              </div>
            </div>
          )
          : (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              {croppedData !== '#'
              && (
                <>
                  <img style={{ width: 300, height: 300, bordeRadius: '50%' }} src={croppedData} alt="cropped" />
                  <ButtonGroup>
                    <Button
                      onClick={undoChanges}
                      style={{ marginTop: '1rem' }}
                      color="secondary"
                      variant="contained"
                      aria-label="undo"
                    >
                      Undo
                    </Button>
                    <Button
                      onClick={saveChanges}
                      style={{ marginTop: '1rem' }}
                      color="primary"
                      variant="contained"
                      aria-label="save"
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </>
              )}
              {
                imageUrl !== '#'
                && (
                  <>
                    <Cropper
                      style={{
                        height: '400px',
                        width: '100%',
                      }}
                      initialAspectRatio={1}
                      // preview=".img-preview"
                      src={imageUrl}
                      viewMode={1}
                      guides={true}
                      responsive={false}
                      autoCropArea={1}
                      checkOrientation={true}
                      cropBoxResizable={false}
                      aspectRatio={1 / 1}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                    <Button
                      onClick={getCropData}
                      style={{ width: '200px', marginTop: '1rem' }}
                      color="secondary"
                      variant="contained"
                      aria-label="crop image"
                    >
                      Crop Image
                    </Button>
                  </>
                )
              }
            </div>
          )
      }
    </div>
  );
}

ProfileImageEditor.propTypes = {
  setImageData: PropTypes.func.isRequired,
  // imageData: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};

export default ProfileImageEditor;
