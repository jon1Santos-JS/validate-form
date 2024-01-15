import { useState } from 'react';
import Description from './Description';

export default function MobileModal() {
    const [toggle, onToggle] = useState(false);

    return (
        <>
            <div
                className={`o-close-modal-container ${
                    !toggle ? 'is-not-appeared' : ''
                }`}
                onClick={() => onToggle(!toggle)}
            >
                <div
                    className="o-mobile-modal l-bg--primary"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => onToggle(!toggle)}
                        className="c-button exit-button l-bg--secondary"
                    >
                        X
                    </button>
                    {<Description />}
                </div>
            </div>
            {
                <button
                    onClick={() => onToggle(!toggle)}
                    className={`c-button o-modal-button l-bg--primary ${
                        toggle ? 'is-not-appeared' : ''
                    }`}
                >
                    ?
                </button>
            }
        </>
    );
}
