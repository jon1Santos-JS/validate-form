import React from 'react';

interface ContextType {
    showInputErrorsByForm: boolean;
}

export default React.createContext<ContextType>({
    showInputErrorsByForm: false,
});
