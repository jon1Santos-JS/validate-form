interface SignUpModalPropsType {
    isModalOpen: () => boolean;
    onCloseModal: () => void;
}

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
                        <h3>{MODAL_TEXT.warningTittle}</h3>
                        <h4>{MODAL_TEXT.warning}</h4>
                        <h4>{MODAL_TEXT.advise}</h4>
                        <h4>{MODAL_TEXT.stepsTittle}</h4>
                        <div>
                            {MODAL_TEXT.step1}{' '}
                            <a
                                href="https://github.com/jon1Santos/validate-form-refactoring"
                                target="blank"
                            >
                                LINK
                            </a>
                        </div>
                        <div>{MODAL_TEXT.step2}</div>
                        <div>{MODAL_TEXT.step3}</div>
                        <div>{MODAL_TEXT.step4}</div>
                        <div>{MODAL_TEXT.step5}</div>
                    </div>
                </div>
            </>
        );
    }
}

const MODAL_TEXT = {
    warningTittle: 'Failed to sign up account',
    warning:
        'Account already exist / You are not in "localhost" server / The limit to create account reached.',
    advise: 'You can access the app using the admin\'s account: [ username: admin1 / password: admin1 ] or execute the app in "localhost".',
    stepsTittle:
        'To execute this application in "localhost", you can clone this project, It\'s just follow the steps below:',
    step1: '1 - Access the following GitHub link: ',
    step2: '2 - Click in "code", choose which one you prefer: "https" or "command line" to clone this repository.',
    step3: '3 - Clone the repository to a folder.',
    step4: '4 - Execute "npm install" on "cli" inside of the folder you have cloned.',
    step5: '5 - Execute "npm run dev"(to execute it in "development mode") or "npm run build" and then "npm run start"(to execute it in "production mode").',
};
