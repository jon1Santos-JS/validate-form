import Image from 'next/image';
import { useUser } from '../../context/UserContext';

export default function PerfilImage() {
    const {
        user: { userImage, isUserImageLoading, setUserImageLoading },
        userState: { isUserStateLoading },
    } = useUser();

    return <>{renderImage()}</>;

    function renderImage() {
        if (isUserStateLoading) return null;
        return (
            <div className="o-perfil-image-container">
                {!isUserImageLoading ? (
                    <Image
                        src={userImage}
                        alt="test image"
                        width={200}
                        height={200}
                        onLoad={onLoadingImage}
                        priority
                        style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '200px',
                            maxHeight: '200px',
                        }}
                    />
                ) : (
                    <div className="o-spinner-container">
                        <div className="spinner-element"></div>
                    </div>
                )}
            </div>
        );
    }

    function onLoadingImage() {
        setUserImageLoading(false);
    }
}
