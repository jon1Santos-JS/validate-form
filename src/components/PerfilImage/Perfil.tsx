import useValidate from '@/hooks/useValidate';
import Input from '../Input';
import { useImage } from '@/context/UserPerfilImageContext';
import useString from '@/hooks/useString';
import camera from '../../../public/camera.svg';
import Image from 'next/image';
import { useRef } from 'react';
import LoadingSpinner from '../LoadingSpinner';

export default function Perfil() {
    const imageInputRef = useRef(null);
    const { validateSingleSync } = useValidate();
    const { handledName } = useString();
    const {
        image,
        setImage,
        imageState,
        setImageState,
        imageInput,
        setImageInput,
        setImageModalState,
    } = useImage();

    return (
        <div className="o-perfil">
            {renderImage()}
            {renderInput()}
        </div>
    );

    async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setImageInput((prev) =>
            validateSingleSync({
                ...prev,
                attributes: {
                    value: e.target.value,
                    files: e.target.files,
                },
            }),
        );
        setImageState((prev) => ({ ...prev, preview: { isLoading: true } }));
        while (!e.target.files) {
            return;
        }
        await onSubmitImageToImageBB(e.target.files);
    }

    async function onSubmitImageToImageBB(filesList: FileList) {
        const file = filesList[0];
        const fileName = handledName(file.name);
        const formData = new FormData();
        formData.append('image', file, fileName);
        const fetchOptions: FetchOptionsType = {
            method: 'POST',
            body: formData,
        };
        const response = await fetch(
            process.env.NEXT_PUBLIC_IMGBB_API_LINK as string,
            fetchOptions,
        );
        const parsedResponse: ImgBBResponseType = await response.json();
        if (!parsedResponse.success) {
            setImageModalState((prev) => ({ ...prev, isOpen: false }));
            return;
        }
        setImage((prev) => ({ ...prev, preview: parsedResponse.data.url }));
    }

    function renderImage() {
        return (
            <>
                <Image
                    src={image.production}
                    alt="test image"
                    priority
                    fill={true}
                    className={`${
                        !imageState.production.isLoading
                            ? 'o-image'
                            : 'is-not-appeared'
                    }`}
                    sizes="(max-width: 768px) 100vw,
                           (max-width: 1200px) 50vw,
                           33vw"
                />
                <LoadingSpinner onShow={imageState.production.isLoading} />
            </>
        );
    }

    function renderInput() {
        return (
            <div className="c-button o-input-image" onClick={onOpenModal}>
                <Image
                    className="image l-bg--secondary"
                    src={camera}
                    alt={'chose image icon'}
                />
                <Input
                    ownProps={{
                        className: 'input-to-hide',
                        inputType: 'file',
                        inputAccept: 'image/*',
                        onChange: (e) => onChange(e),
                        ref: imageInputRef,
                    }}
                    inputStateProps={{
                        input: imageInput,
                    }}
                />
            </div>
        );
    }

    function onOpenModal() {
        if (imageState.production.isLoading) return;
        setImageModalState((prev) => ({
            ...prev,
            isOpen: true,
        }));
        if (imageInputRef.current)
            (imageInputRef.current as HTMLInputElement).click();
    }
}
