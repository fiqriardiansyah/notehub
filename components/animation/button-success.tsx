import animationData from "@/asset/animation/mini-convetti.json";
import { useBridgeEvent } from "@/hooks/use-bridge-event";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Lottie from "react-lottie";

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const BUTTON_SUCCESS_ANIMATION_TRIGGER = "button_success_animation_trigger_";

export type ButtonSuccessAnimType = React.HTMLProps<HTMLDivElement> & {
  message?: string;
  id?: string;
  children?: any;
};

export default function ButtonSuccessAnim({ children, className, message, id, ...props }: ButtonSuccessAnimType) {
  const [show, setShow] = React.useState(false);

  const Children = () =>
    React.Children.map(children, (child) =>
      React.cloneElement(child, {
        className: `${child.props.className} z-1`,
      })
    );

  React.useEffect(() => {
    let timeout;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (show) {
        setShow((prev) => !prev);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  const handler = () => {
    setShow(true);
  };

  useBridgeEvent(BUTTON_SUCCESS_ANIMATION_TRIGGER + id, handler);

  return (
    <div {...props} tabIndex={-1} className={`relative ${className}`}>
      <AnimatePresence>
        {show && (
          <motion.p
            tabIndex={-1}
            initial={{ scale: 0, rotate: "20deg", y: "50%", opacity: 0 }}
            animate={{
              scale: 1,
              rotate: "-10deg",
              opacity: 1,
              transition: { delay: 0.3 },
              y: "-130%",
            }}
            exit={{ scale: 0, rotate: "20deg", y: "50%", opacity: 0 }}
            style={{ position: "absolute" }}
            className="font-semibold text-sm whitespace-nowrap pointer-events-none"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
      <div tabIndex={-1} className="pointer-events-none absolute m-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <AnimatePresence>
          {show && (
            <motion.div animate={{ scale: 1 }} exit={{ scale: 0 }} initial={{ scale: 0 }}>
              <Lottie isStopped={!show} options={defaultOptions} height={120} width={120} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Children />
    </div>
  );
}
