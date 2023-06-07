interface SignUpModalPropsType {
    isModalOpen: () => boolean;
    onCloseModal: () => void;
}

const MODAL_TEXT = {
    warning:
        'Failed to sign up account, account already exist or you are not in "localhost" server',
    stepsTittle:
        'To execute this application in "localhost" follow the steps below:',
    step1: '1 - Access the following link: https://github.com/jon1Santos/validate-form-refactoring',
    step2: '2 - Click in "code", choose which one you prefer: "https" or "command line" to clone this repository',
    step3: '3 - Execute "npm install" on "cli" inside of the file you have cloned',
    step4: '4 - Execute "npm run dev"(to execute it in "development mode") or "npm run build" and then "npm run start"(to execute it in "production mode")',
};

export default function SignUpModal({
    isModalOpen,
    onCloseModal,
}: SignUpModalPropsType) {
    return <>{renderContent()}</>;

    function renderContent() {
        if (!isModalOpen()) return null;
        return (
            <>
                <div className="o-modal o-sign-up-modal" onClick={onCloseModal}>
                    <div
                        className="l-base-bg-color content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{MODAL_TEXT.warning}</h3>
                        <h4>{MODAL_TEXT.stepsTittle}</h4>
                        <div>{MODAL_TEXT.step1}</div>
                        <div>{MODAL_TEXT.step2}</div>
                        <div>{MODAL_TEXT.step3}</div>
                        <div>{MODAL_TEXT.step4}</div>
                    </div>
                </div>
            </>
        );
    }
}
