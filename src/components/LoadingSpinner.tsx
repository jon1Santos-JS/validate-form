import { ReactNode } from 'react';

type LoadingSpinnerProps = {
    isOpen: boolean;
    children: ReactNode;
};

export default function LoadingSpinner({
    isOpen,
    children,
}: LoadingSpinnerProps) {
    return (
        <>
            <div className={`${isOpen ? 'o-spinner-container' : ''}`}>
                <div className={`${isOpen ? 'spinner-element' : ''}`}>
                    {children}
                </div>
            </div>
        </>
    );
}
