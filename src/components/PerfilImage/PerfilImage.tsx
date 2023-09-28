import Image from 'next/image';
type PerfilImagePropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function PerfilImage({
    handleUserProps,
}: PerfilImagePropsTypes) {
    const {
        isUserStateLoading,
        user,
        setUserImageLoading,
        isUserImageLoading,
    } = handleUserProps;

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
                {isUserImageLoading && (
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
