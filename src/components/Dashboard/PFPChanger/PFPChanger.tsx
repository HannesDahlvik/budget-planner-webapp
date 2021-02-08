import React from 'react'
import './PFPChanger.scss'

import ReactCrop from 'react-image-crop'

import firebase from 'firebase'

// Chakra UI
import { Box, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from '@chakra-ui/react'
import ErrorHandler from '../../../utils/ErrorHandler'
import { toast } from 'react-toastify'
import store from '../../../redux/store'

class PFPChanger extends React.Component<any, any> {
    imageRef: any
    fileUrl: any

    constructor(props: any) {
        super(props)

        this.state = {
            src: null,
            crop: {
                unit: '%',
                width: 30,
                aspect: 1 / 1,
                minWidth: 10,
                minHeight: 10
            },
            changingPfp: false
        }
    }

    handleClose = () => {
        store.dispatch({ type: 'closePfpChanger', newState: false })
    }

    onSelectFile = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                this.setState({ src: reader.result })
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    onImageLoaded = (image: any) => {
        this.imageRef = image
    }

    onCropComplete = (crop: any) => {
        this.makeClientCrop(crop)
    }

    onCropChange = (crop: any, percentCrop: any) => {
        this.setState({ crop })
    }

    async makeClientCrop(crop: any) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                this.createRandomString(25)
            );
            this.setState({ croppedImageUrl })
        }
    }

    getCroppedImg(image: any, crop: any, fileName: any) {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx: any = canvas.getContext('2d')

        ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, crop.width, crop.height)

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob: any) => {
                if (!blob) {
                    new ErrorHandler('Canvas is empty')
                    return
                }
                this.setState({ file: blob })
                blob.name = fileName
                window.URL.revokeObjectURL(this.fileUrl)
                this.fileUrl = window.URL.createObjectURL(blob)
                resolve(this.fileUrl)
            }, 'image/jpeg')
        })
    }

    createRandomString = (length: number) => {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    saveAvatarChanges = async () => {
        this.setState({ changingPfp: true })

        await this.doRemoveLastUsedPFP()
            .catch((err: Error) => new ErrorHandler(err.message))

        await this.doUploadPFP(this.state.file)
            .then((imageUrl: any) => {
                firebase.auth().currentUser?.updateProfile({
                    photoURL: imageUrl
                })
                    .then(() => {
                        this.setState({ file: null, src: null, width: 30, changingPfp: false })
                        toast.success('Changed profile picture!')
                        this.handleClose()
                    })
                    .catch((err: Error) => new ErrorHandler(err.message))
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    doUploadPFP = async (file: any) => {
        const metadata: any = {
            customMetadata: {
                'uid': firebase.auth().currentUser?.uid,
                'name': `avatars/${file.name}`
            }
        }

        let returnData;
        const ref = firebase.storage().ref('avatars/' + file.name);
        await ref.put(file, metadata).then(res => {
            returnData = res.metadata.fullPath;
        }).catch(err => new ErrorHandler(err.message));
        const imageURL = await firebase.storage().ref(returnData).getDownloadURL();
        return imageURL
    }

    doRemoveLastUsedPFP = async () => {
        const photoUrl: any = firebase.auth().currentUser?.photoURL
        const imageToDelete = await firebase.storage().refFromURL(photoUrl)
        if (imageToDelete) {
            await imageToDelete.delete()
                .catch((err: Error) => new ErrorHandler(err.message))
            return true
        }
        return false
    }

    eventFire(el: any, etype: any) {
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

    render() {
        const { src, crop }: any = this.state

        return (
            <Modal
                isOpen={this.props.isOpen}
                onClose={() => this.handleClose()}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader id="alert-dialog-title">{"Change profile picture"}</ModalHeader>
                    <ModalBody>
                        <Button
                            disabled={this.state.changingPfp}
                            onClick={() => document.getElementById('select-avatar-input')?.click()}
                            style={{ width: '100%' }}
                            colorScheme="blue"
                        >
                            Select image
                        </Button>
                        <input
                            onChange={this.onSelectFile}
                            id="select-avatar-input"
                            type="file"
                            accept="image/*"
                        />
                        <Box
                            as="div"
                            className="center"
                            mt={4}
                        >
                            {src && (
                                <ReactCrop
                                    src={src}
                                    crop={crop}
                                    circularCrop
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                >
                                    {this.state.changingPfp ? (
                                        <div className="changing-pfp-spinner-wrapper">
                                            <Spinner size="xl" className="changing-pgp-spinner" />
                                        </div>
                                    ) : <></>}
                                </ReactCrop>
                            )}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handleClose} variant="solid" className="mr2">Cancel</Button>
                        <Button onClick={this.saveAvatarChanges} variant="solid">Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }
}

export default PFPChanger