interface SignUpModalPropsType {
    isModalOpen: boolean;
    onCloseModal: () => void;
}

export default function SignUpModal({
    isModalOpen,
    onCloseModal,
}: SignUpModalPropsType) {
    return <>{renderContent()}</>;

    function renderContent() {
        if (!isModalOpen) return null;
        const advice = {
            warningTittle: 'Failed to sign up account',
            warning:
                'Account already exist or The limit to create account reached.',
            advise: "The limit to create account reached: You can access the app using the admin's account: [ username: admins / password: admins ] and reset database.",
            stepsTittle:
                'If the error persist: Try to execute this application in "localhost", you can clone this project just by following the steps below:',
        };

        const steps = createSteps();

        return (
            <>
                <div className="o-modal o-sign-up-modal" onClick={onCloseModal}>
                    <div
                        className="l-base-bg-color content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{advice.warningTittle}</h3>
                        <h4>{advice.warning}</h4>
                        <h4>{advice.advise}</h4>
                        <h4>{advice.stepsTittle}</h4>
                        <>
                            {steps.map((step) => {
                                if (step.includes('GitHub link'))
                                    return (
                                        <div key={step}>
                                            {step}
                                            <a
                                                href="https://github.com/jon1Santos/validate-form-refactoring"
                                                target="blank"
                                            >
                                                LINK
                                            </a>
                                        </div>
                                    );
                                return <div key={step}>{step}</div>;
                            })}
                        </>
                    </div>
                </div>
            </>
        );

        function createSteps() {
            const steps = [
                `Access the following GitHub link: `,
                'Click in "code", choose which one you prefer: "https" or "command line" to clone this repository.',
                'Clone the repository to a folder.',
                'Follow the steps to set ENV variables in the link',
                'Execute "npm install" on "cli" inside of the folder you have cloned.',
                'Execute "npm run dev"(to execute it in "development mode") or "npm run build" and then "npm run start"(to execute it in "production mode").',
            ];

            const newSteps = steps.map(
                (step, index) => `${(index + 1).toString()} - ${step}`,
            );

            return newSteps;
        }
    }
}
