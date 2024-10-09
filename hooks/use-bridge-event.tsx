import mitt from 'mitt';
import React from 'react';

const emitter = mitt();
const eventQueue: { key: string, payload: any }[] = [];

// Wrap the event emitter to queue events if needed
export function fireBridgeEvent(key: string, payload: any) {
    // If no listeners are registered, queue the event
    if (!emitter.all.has(key)) {
        eventQueue.push({ key, payload });
        console.log("Event queued since no listener registered yet.");
    } else {
        emitter.emit(key, payload);
    }
}

// Hook to subscribe to events and process queued ones when component mounts
export function useBridgeEvent(eventKey: string, callback: (payload: any) => void) {
    React.useEffect(() => {
        emitter.on(eventKey, callback);

        // Process queued events when component mounts
        eventQueue.forEach(({ key, payload }, index) => {
            if (key === eventKey) {
                callback(payload);
                eventQueue.splice(index, 1); // Remove from queue after processing
            }
        });

        // Clean up when the component unmounts
        return () => {
            emitter.off(eventKey, callback);
        };
    }, [eventKey, callback]);
}
