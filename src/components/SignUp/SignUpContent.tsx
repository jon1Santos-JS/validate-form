import { useState } from 'react';
import SignUpForm, { SignUpInputs } from './SignUpForm';
import SignUpModal from './SignUpModal';

interface SignUpContentPropsType {
    handleInputsProps: HandleInputsPropsType<SignUpInputs>;
    handleUserProps: HandleUserPropsType;
}

export default function SignUpContent({
    handleInputsProps,
    handleUserProps,
}: SignUpContentPropsType) {
    const [signUpResponse, setSignUpResponse] = useState(false); // SHOW MODAL
    return (
        <>
            <SignUpForm
                ownProps={{
                    setResponse: (data: boolean) => setSignUpResponse(data),
                }}
                handleInputsProps={handleInputsProps}
                handleUserProps={handleUserProps}
            />
            <SignUpModal
                isModalOpen={() => signUpResponse}
                onCloseModal={() => setSignUpResponse(false)}
            />
        </>
    );
}
