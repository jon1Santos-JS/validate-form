import Image from 'next/image';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../LoadingSpinner';
import useUtils from '@/hooks/useUtils';

const IMAGE_LOADING_TIMER = 2000;

export default function PerfilImage() {
    const {
        user: { userImage },
        userState: { isUserStateLoading },
        userImageState: { isUserImageLoading },
        setUserImageState,
    } = useUser();
    const { onSetTimeOut } = useUtils();

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
                        !isUserImageLoading
                            ? 'perfil-image'
                            : 'is-image-not-display'
                    }`}
                />
                <LoadingSpinner onShow={isUserImageLoading} />
            </div>
        );
    }

    function onLoadingImage() {
        onSetTimeOut(() => {
            setUserImageState((prev) => ({
                ...prev,
                isUserImageLoading: false,
            }));
        }, IMAGE_LOADING_TIMER);
    }
}
