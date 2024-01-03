import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading, onLoadingUserImage },
    } = useUser();

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
                <div
                    className={`${
                        isUserImageLoading ? 'o-spinner-container' : ''
                    }`}
                >
                    <div
                        className={`${
                            isUserImageLoading ? 'spinner-element' : ''
                        }`}
                    ></div>
                </div>
                {/* <LoadingSpinner isOpen={isUserImageLoading} /> */}
            </div>
        );
    }

    function onLoadingImage() {
        onLoadingUserImage(false);
    }
}
