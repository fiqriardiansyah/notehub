import { useEffect, useRef } from 'react';

function useSkipFirstRender(effect: () => void, deps: any) {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export default useSkipFirstRender;