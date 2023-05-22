import React from 'react';

interface FormContextType {
    showInputErrorsMessagesByForm: boolean;
}

export default React.createContext<FormContextType>({
    showInputErrorsMessagesByForm: false,
});
