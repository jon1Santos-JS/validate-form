import { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignUpModal from './SignUpModal';

interface SignUpContentPropsType {
    handleUserProps: HandleUserPropsType;
}

export default function SignUpContent({
    handleUserProps,
}: SignUpContentPropsType) {
    const [modalState, setModalState] = useState(false); // SHOW MODAL
    return (
        <>
            <SignUpForm
                ownProps={{
                    setModalState,
                }}
                handleUserProps={handleUserProps}
            />
            <SignUpModal
                isModalOpen={modalState}
                onCloseModal={() => setModalState(false)}
            />
        </>
    );
}
