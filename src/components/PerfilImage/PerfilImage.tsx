import Image from 'next/image';
import { useUser } from '../../context/UserContext';

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        isUserImageLoading,
        setUserImageLoader,
    } = useUser();

    return <>{renderImage()}</>;

    function renderImage() {
        if (isUserStateLoading) return null;
        return (
            <div className="o-perfil-image-container">
                <div
                    className={`${
                        isUserImageLoading ? 'o-spinner-container' : ''
                    }`}
                >
                    <div
                        className={`${
                            isUserImageLoading ? 'spinner-element' : ''
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
                                isUserImageLoading
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
        setUserImageLoader(false);
    }
}
