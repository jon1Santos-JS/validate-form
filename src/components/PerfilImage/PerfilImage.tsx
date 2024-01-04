import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';
import { useRef } from 'react';

const IMAGE_LOADING_TIMER = 1000;

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading, onLoadingUserImage },
    } = useUser();
    const oldImage = useRef(userImage);

    return <>{renderImage()}</>;
    function renderImage() {
        if (isUserStateLoading) return null;
        return (
            <div className="o-perfil-image-container">
                <Image
                    src={userImage}
                    alt="test image"
                    priority
                    onLoad={onLoadingImage}
                    width={200}
                    height={200}
                    className={`${
                        isUserImageLoading
                            ? 'is-image-not-display'
                            : 'perfil-image'
                    }`}
                />
                <LoadingSpinner onShow={isUserImageLoading} />
            </div>
        );
    }

    function onLoadingImage() {
        if (oldImage.current !== userImage) {
            // setTimeout(() => {
            //     onLoadingUserImage(false);
            // }, IMAGE_LOADING_TIMER);
            onLoadingUserImage(false);
        }
    }
}
