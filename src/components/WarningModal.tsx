import { useEffect } from 'react';

type WarningModalProps = {
    message: string;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
};

export default function WarningModal({
    message,
    isOpen,
    onClose,
    className,
}: WarningModalProps) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose();
        }, 2750);
        return () => clearTimeout(timeout);
    }, [isOpen, onClose]);

    return (
        <div
            className={`o-warning-modal ${isOpen ? '' : 'is-not-appeared'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`message ${className}`}>{message}</div>
        </div>
    );
}
