import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignUpModal from './SignUpModal';

interface SignUpContentPropsType {
    handleUserProps: HandleUserPropsType;
}

export default function SignUpContent({
    handleUserProps,
}: SignUpContentPropsType) {
    const [signUpResponse, setSignUpResponse] = useState(false); // SHOW MODAL
    return (
        <>
            <SignUpForm
                ownProps={{
                    onShowModal: (data: boolean) => setSignUpResponse(data),
                }}
                handleUserProps={handleUserProps}
            />
            <SignUpModal
                isModalOpen={() => signUpResponse}
                onCloseModal={() => setSignUpResponse(false)}
            />
        </>
    );
}
