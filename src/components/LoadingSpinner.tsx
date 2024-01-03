type LoadingSpinnerProps = {
    onShow: boolean;
};

export default function LoadingSpinner({ onShow }: LoadingSpinnerProps) {
    return (
        <>
            <div className={`${onShow ? 'o-spinner-container' : ''}`}>
                <div className={`${onShow ? 'spinner-element' : ''}`}></div>
            </div>
        </>
    );
}
