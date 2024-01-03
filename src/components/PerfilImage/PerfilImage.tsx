import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';
import { useRef } from 'react';

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading, onLoadingUserImage },
    } = useUser();
    const image = useRef(userImage);

    return <>{renderImage()}</>;
    function renderImage() {
        if (isUserStateLoading) return null;
        return (
            <div className="o-perfil-image-container">
                <LoadingSpinner isOpen={isUserImageLoading}>
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
                </LoadingSpinner>
            </div>
        );
    }

    function onLoadingImage() {
        if (image.current !== userImage) onLoadingUserImage(false);
    }
}
