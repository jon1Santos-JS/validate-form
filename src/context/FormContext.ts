import React from 'react';

interface ContextType {
    showInputErrorsMessagesByForm: boolean;
}

export default React.createContext<ContextType>({
    showInputErrorsMessagesByForm: false,
});
