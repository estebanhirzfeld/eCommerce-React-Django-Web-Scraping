import BASE_URL from '../../constants'


import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { payOrder, orderUploadProofUnlogged } from '../actions/orderActions'
import QRCode from 'react-qr-code';


// import css
import './Test.css';

function Test({ id, token, logged = true }) {
    const dispatch = useDispatch()
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const orderPay = useSelector(state => state.orderPay)
    const { paymentLink, success, error: errorPay } = orderPay

    const orderProof = useSelector(state => state.orderUploadProofUnlogged)
    const { success: successProof, error: errorProof } = orderProof

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragging-over');
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            setError(null);
            setImage(file);
        } else {
            setError('Invalid file type. Please select an image.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // apply the visual effect
        e.currentTarget.classList.add('dragging-over');
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        if (image && image.name === e.target.dataset.filename) {
            setImage(null);
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (image && image.name === file.name) {
                fileInputRef.current.value = '';
            } else {
                setError(null);
                setImage(file);
            }
        } else {
            setError('Invalid file type. Please select an image.');
        }
    };


    const payHandler = () => {
        console.log(`dispatching with ${id} and ${image}`)
        dispatch(payOrder(id, 'Tranferencia Bancaria', image))
    }

    useEffect(() => {
        if (success || successProof) {
            alert('Upload successful')
        }
        else if (errorPay || errorProof) {
            alert(errorPay || errorProof)
        }
    }, [success, successProof, errorPay, errorProof])


    return (
        <Row className='justify-content-center align-items-start'>
            {/* <div className="file-upload-wrapper col-12 col-md-8" > */}
            {/* if logged is false col-md-12 */}
            <div className={`file-upload-wrapper col-12 col-md-8 ${logged ? 'col-md-8' : 'col-md-12'}`} >
                <p>Attach the proof of payment</p>

                <Card
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`card-body card-dragdrop view file-upload ${image ? 'has-image' : ''}`}
                    // on hover change the border color
                    style={{ border: '1px dashed #ccc', padding: '20px', borderRadius: '5px' }}
                    onClick={handleClick}
                >
                    {!image && (
                        <div className="card-text file-upload-message d-flex flex-column align-items-center justify-content-center" style={{ cursor: 'pointer' }}>
                            <i className="fa-solid fa-cloud-arrow-up fa-2xl mt-4"></i>
                            <p className='mt-3'>Drag and drop a file here or click</p>
                            {error && <p className="file-upload-error">{error}</p>}
                        </div>
                    )}
                    {image && (
                        <div className="file-upload-preview">
                            <span className="file-upload-render">
                                <img src={URL.createObjectURL(image)} alt="Preview" className='w-100 imageDrop' style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }} />
                                <div className='imageDeleteDiv'>
                                    <p>Change Image</p>
                                </div>
                            </span>
                            <div className="file-upload-infos">
                                <div className="file-upload-infos-inner">
                                    <p className="file-upload-filename">
                                        <span className="file-upload-filename-inner">
                                            {/* {image.name} */}
                                            {image.name.length > 20 ? image.name.substring(0, 15) + '...' : image.name}
                                        </span>
                                    </p>
                                    <p className="file-upload-infos-message">
                                        Drag and drop or click to replace
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mask rgba-stylish-slight" style={{ display: 'none' }}></div>
                    <div className="file-upload-errors-container" style={{ display: 'none' }}>
                        <ul></ul>
                    </div>
                    <input type="file" id="input-file-max-fs" className="file_upload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} ref={fileInputRef} />
                    {image && (
                        <Button type="button" variant="danger" size="sm" className="waves-effect waves-light" data-filename={image.name} onClick={handleRemoveImage} style={{ marginTop: '10px' }}>
                            Remove <i className="fa-solid fa-trash ml-1"></i>
                        </Button>
                    )}
                </Card>
                <Button
                    type='button'
                    className='btn btn-block mt-3'
                    // if logged is false change function to orderUploadProofUnlogged
                    // onClick={payHandler}
                    onClick={logged ? payHandler : () => dispatch(orderUploadProofUnlogged(id, token, image))}
                >
                    Upload Proof of Payment
                </Button>
            </div>
            {/* if logged = false dont show Qr */}
            {logged && (
                <div className='d-none d-md-block col-4 col-md-4'>
                    <p>Or scan the QR code</p>
                    <QRCode
                        // value={`http://localhost:5173/payment-proof/?orderId=${id}&token=${token}`}
                        // https://b9b9-186-127-157-186.ngrok-free.app
                        // value={`https://b9b9-186-127-157-186.ngrok-free.app/payment-proof/?orderId=${id}&token=${token}`}
                        value={`https://youtu.be/dQw4w9WgXcQ`}
                        size={125}
                    />
                </div>
            )}

        </Row>
    );
}

export default Test;

