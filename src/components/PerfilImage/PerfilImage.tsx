import Image from 'next/image';
import { useState } from 'react';
type PerfilImagePropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function PerfilImage({
    handleUserProps,
}: PerfilImagePropsTypes) {
    const [loading, setLoading] = useState(true);
    const { isUserStateLoading, user } = handleUserProps;

    return <>{renderImage()}</>;

    function renderImage() {
        if (isUserStateLoading || !user.userImage) return null;
        return (
            <div className="o-perfil-image-container">
                <Image
                    src={user.userImage}
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
                {loading && (
                    <div className="o-spinner-container">
                        <div className="spinner-element"></div>
                    </div>
                )}
            </div>
        );
    }

    function onLoadingImage() {
        setLoading(false);
    }
}
