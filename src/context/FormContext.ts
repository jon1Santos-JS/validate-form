import React from 'react';

interface FormContextType {
    showMessagesByForm: boolean;
}

export default React.createContext<FormContextType>({
    showMessagesByForm: false,
});
