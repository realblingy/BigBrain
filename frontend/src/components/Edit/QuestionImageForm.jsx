import React from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Button } from '@material-ui/core';
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
  height: 400,
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

function QuestionImageForm() {
  const [imageFileObj, setImageFileObj] = React.useState(null);
  const [imageUploaded, setImageUploaded] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [cropper, setCropper] = React.useState();
  const [cropData, setCropData] = React.useState('#');
  // const [cropping, setCropping] = useState(false);

  React.useEffect(() => {
    if (imageFileObj !== null || undefined) {
      setImageUploaded(true);

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
      setCropData(cropper.getCroppedCanvas().toDataURL());
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
      console.log(imageUrl);
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

  const handleRemoveImageBtnClick = () => {
    setCropData('#');
    setImageFileObj(null);
    setImageUrl('');
    setImageUploaded(false);
  };

  return (
    <>
      {
        !imageUploaded
          ? (
            <div {...getRootProps({ style })}>
              <input type="file" {...getInputProps()} />
              <p>Drag n drop a picture here, or click to select file</p>
              <em>(Only *.jpeg and *.png images will be accepted)</em>
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
              {cropData !== '#'
              && (
                <>
                  <img style={{ width: 640, height: 360 }} src={cropData} alt="cropped" />
                  <Button
                    onClick={handleRemoveImageBtnClick}
                    style={{ marginTop: '1rem' }}
                    color="secondary"
                    variant="contained"
                  >
                    Remove Image
                  </Button>
                </>
              )}
              {
                cropData === '#'
                && (
                  <>
                    <Cropper
                      style={{ height: '400px', width: '100%' }}
                      initialAspectRatio={1}
                      // preview=".img-preview"
                      src={imageUrl}
                      viewMode={1}
                      guides={true}
                      responsive={false}
                      autoCropArea={1}
                      checkOrientation={true}
                      cropBoxResizable={false}
                      aspectRatio={16 / 9}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                    />
                    <Button
                      onClick={getCropData}
                      style={{ width: '200px', marginTop: '1rem' }}
                      color="secondary"
                      variant="contained"
                    >
                      Crop Image
                    </Button>
                  </>
                )
              }
            </div>
          )
      }
    </>
  );
}

// QuestionImageForm.propTypes = {
//   imageUrl: PropTypes.string.isRequired,
// };

export default QuestionImageForm;
