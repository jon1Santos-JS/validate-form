import Image from 'next/image';
type PerfilImagePropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function PerfilImage({
    handleUserProps,
}: PerfilImagePropsTypes) {
    const { isUserStateLoading, user } = handleUserProps;
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
