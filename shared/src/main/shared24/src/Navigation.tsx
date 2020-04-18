import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const Navigation = () => {
    const [locationKeys, setLocationKeys] = useState<string[]>([]);
    const history = useHistory();

    useEffect(() => {
        return history.listen(location => {
            if (history.action === 'PUSH') {
                setLocationKeys([location.key!]);
            }

            if (history.action === 'POP') {
                if (locationKeys[1] === location.key) {
                    setLocationKeys(([_, ...keys]) => keys);
                    history.goForward();
                } else {
                    setLocationKeys(keys => [location.key!, ...keys]);
                    history.goBack();
                }
            }
        });
    }, [locationKeys]);

    return null;
};
