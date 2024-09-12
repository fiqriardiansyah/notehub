import { AnimatePresence, motion } from "framer-motion"
import React from "react"
import Lottie from "react-lottie";
import animationData from '@/asset/animation/mini-convetti.json';

const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const BUTTON_SUCCESS_ANIMATION_TRIGGER = "button_success_animation_trigger_";

export type ButtonSuccessAnimType = React.HTMLProps<HTMLDivElement> & {
    message?: string;
    id?: string;
    children?: any;
}

export default function ButtonSuccessAnim({ children, className, message, id, ...props }: ButtonSuccessAnimType) {
    const [show, setShow] = React.useState(false);

    const Children = () =>
        React.Children.map(children, child =>
            React.cloneElement(child, {
                className: `${child.props.className} relative z-1`
            })
        );

    React.useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow((prev) => !prev);
            }, 3000);
        }
    }, [show]);

    React.useEffect(() => {
        const handler = (e: any) => {
            if (show) return;
            setShow(true);
        }

        window.addEventListener(BUTTON_SUCCESS_ANIMATION_TRIGGER + id, handler);
        return () => {
            window.removeEventListener(BUTTON_SUCCESS_ANIMATION_TRIGGER + id, handler);
        }
    }, []);

    return (
        <div {...props} className={`relative ${className}`}>
            <AnimatePresence>
                {show && (
                    <motion.p
                        animate={{ scale: 1, rotate: '-10deg', opacity: 1, transition: { delay: 0.3 }, y: '-130%' }}
                        exit={{ scale: 0, rotate: '20deg', y: '50%', opacity: 0 }}
                        style={{ position: 'absolute' }}
                        className="font-semibold text-sm whitespace-nowrap pointer-events-none">{message}</motion.p>
                )}
            </AnimatePresence>
            <Lottie
                isStopped={!show}
                options={defaultOptions}
                height={120}
                width={120}
                style={{ margin: 0, position: 'absolute', zIndex: 0, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
            <Children />
        </div>
    )
}