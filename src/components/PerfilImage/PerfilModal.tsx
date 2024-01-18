import useValidate from '@/hooks/useValidate';
import { useImage } from '@/context/UserPerfilImageContext';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';

const API = 'api/updateUserImage';

export default function PerfilFormModal() {
    const {
        image,
        setImage,
        imageInput,
        setImageInput,
        imageInputState,
        setImageInputState,
        imageState,
        setImageState,
        imageModalState: { isOpen },
        setImageModalState,
    } = useImage();
    const { validateManySync } = useValidate();

    return (
        <div
            className={`o-perfil-modal ${isOpen ? '' : 'is-not-appeared'}`}
            onClick={onClose}
        >
            <div
                className="container l-bg--primary"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="image-container l-bg--secondary">
                    <Image
                        src={image.preview}
                        alt="test image"
                        priority
                        fill={true}
                        onLoad={onLoadingImage}
                        className={`image ${
                            imageState.preview.isLoading
                                ? 'is-not-appeared'
                                : ''
                        }`}
                        sizes="(max-width: 768px) 100vw,
                           (max-width: 1200px) 50vw,
                           33vw"
                    />
                    <LoadingSpinner onShow={imageState.preview.isLoading} />
                </div>
                <div className="buttons">
                    <button className="c-button button" onClick={onSubmit}>
                        Submit
                    </button>
                    <button className="c-button button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
                <div className="errors">{renderError()}</div>
            </div>
        </div>
    );

    async function onSubmit(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (imageState.preview.isLoading) return;
        if (imageState.production.isLoading) return;
        if (!validateManySync({ imageInput })) {
            setImageInputState((prev) => ({ ...prev, showInputMessage: true }));
            return;
        }
        setImageModalState((prev) => ({
            ...prev,
            isOpen: false,
        }));
        setImageState((prev) => ({ ...prev, production: { isLoading: true } }));
        await onSubmitImageToDB();
        setImageState((prev) => ({
            ...prev,
            production: { isLoading: false },
        }));
    }

    async function onSubmitImageToDB() {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: image.preview }),
        };
        const response = await fetch(API, options);
        const parsedResponse: DBUpdateUserImageResponse = await response.json();
        setImageInput((prev) => ({
            ...prev,
            attributes: { value: '', files: null },
        }));
        if (!parsedResponse.success) {
            return;
        }
        setImage((prev) => ({
            ...prev,
            production: parsedResponse.data.value,
            preview: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        }));
    }

    function onClose() {
        setImageState((prev) => ({
            ...prev,
            preview: {
                isLoading: false,
            },
            production: {
                isLoading: false,
            },
        }));
        setImageModalState((prev) => ({
            ...prev,
            isOpen: false,
        }));
        setImage((prev) => ({
            ...prev,
            preview: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        }));
        setImageInput((prev) => ({
            ...prev,
            attributes: { ...prev.attributes, files: null, value: '' },
        }));
    }

    function renderError() {
        return imageInputState.showInputMessage ? imageInput.errors[0] : null;
    }

    function onLoadingImage() {
        setImageState((prev) => ({
            ...prev,
            preview: {
                isLoading: false,
            },
        }));
    }
}
