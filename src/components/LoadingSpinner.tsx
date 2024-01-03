type LoadingSpinnerProps = {
    isOpen: boolean;
};

export default function LoadingSpinner({ isOpen }: LoadingSpinnerProps) {
    return (
        <>
            <div className={`${isOpen ? 'o-spinner-container' : ''}`}>
                <div className={`${isOpen ? 'spinner-element' : ''}`}></div>
            </div>
        </>
    );
}
