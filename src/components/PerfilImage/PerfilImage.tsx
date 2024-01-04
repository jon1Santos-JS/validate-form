import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';
import { useRef } from 'react';

// const IMAGE_LOADING_TIMER = 1000;

export default function PerfilImage() {
    const {
        user: { userImage },
        setUser,
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading },
        setUserImageState,
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
        setUser((prev) => {
            if (prev.userImage === userImage) {
                setUserImageState((prev) => ({
                    ...prev,
                    isUserImageLoading: false,
                }));
            }
            return prev;
        });
    }
}
