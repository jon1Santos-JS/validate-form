import Image from 'next/image';
type PerfilImagePropsTypes = HandlerUserStateProps;

export default function PerfilImage({
    isUserStateLoading,
    user,
}: PerfilImagePropsTypes) {
    return <>{renderImage()}</>;

    function renderImage() {
        if (isUserStateLoading || !user.userImage) return null;
        return (
            <>
                <Image
                    src={user.userImage}
                    alt="test image"
                    width={200}
                    height={200}
                />
            </>
        );
    }
}
