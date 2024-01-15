type DashboardModalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
};

export default function DashboardModal({
    children,
    isOpen,
    onClose,
}: DashboardModalProps) {
    return (
        <div
            className={`o-close-modal-container  ${
                !isOpen ? 'is-not-appeared' : ''
            }`}
            onClick={onClose}
        >
            <div
                className="o-dashboard-modal l-bg--thirty"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="c-button exit-button l-bg--scondary"
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
}
