import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';
import { useState } from 'react';
// import { useRef } from 'react';

// const IMAGE_LOADING_TIMER = 1000;

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading },
        setUserImageState,
    } = useUser();
    const [isLoadComplete, setOnLoad] = useState(false);

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
                        !isUserImageLoading && isLoadComplete
                            ? 'perfil-image'
                            : 'is-image-not-display'
                    }`}
                />
                <LoadingSpinner onShow={isUserImageLoading} />
            </div>
        );
    }

    function onLoadingImage() {
        setOnLoad(true);
        setUserImageState((prev) => ({
            ...prev,
            isUserImageLoading: false,
        }));
    }
}
