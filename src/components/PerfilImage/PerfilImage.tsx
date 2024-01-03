import Image from 'next/image';
import { useUser } from '../../context/UserContext';

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState,
    } = useUser();

    return <>{renderImage()}</>;

    function renderImage() {
        if (isUserStateLoading) return null;
        return (
            <div className="o-perfil-image-container">
                <div
                    className={`${
                        userImageState.isUserImageLoading
                            ? 'o-spinner-container'
                            : ''
                    }`}
                >
                    <div
                        className={`${
                            userImageState.isUserImageLoading
                                ? 'spinner-element'
                                : ''
                        }`}
                    >
                        <Image
                            src={userImage}
                            alt="test image"
                            priority
                            onLoad={onLoadingImage}
                            width={200}
                            height={200}
                            className={`${
                                userImageState.isUserImageLoading
                                    ? 'is-image-not-display'
                                    : 'perfil-image'
                            }`}
                        />
                    </div>
                </div>
            </div>
        );
    }

    function onLoadingImage() {
        userImageState.onLoadingUserImage(false);
    }
}
