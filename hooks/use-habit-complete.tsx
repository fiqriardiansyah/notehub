import { Button } from "@/components/ui/button";
import Lottie from "react-lottie";
import carAnimation from '@/asset/animation/car.json';
import cupAnimation from '@/asset/animation/cup.json';
import doneAnimation from '@/asset/animation/done.json';
import lamaAnimation from '@/asset/animation/lama.json';
import { useOverlay } from "@/components/overlay";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const JSON_ANIMATIONS = [cupAnimation, carAnimation, lamaAnimation, doneAnimation];
export const WORD_CONGRATS = ["Congratulation!", "Awesome Job!", "You Rule!", "Nicely Done!", "You Rocked!", "You are on Fire!", "Woohoo!", "Habits Complete!", "Good Job!"];

export default function useHabitComplete() {
    const overlay = useOverlay();

    const show = () => {

        const randomAnimate = JSON_ANIMATIONS[Math.floor(Math.random() * JSON_ANIMATIONS.length)];
        const wordCongrat = WORD_CONGRATS[Math.floor(Math.random() * WORD_CONGRATS.length)];

        overlay.showContent(
            <div className="w-full h-full flex flex-col items-center justify-center container-custom">
                <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: randomAnimate }} height={300} width={300} />
                <p className="drop-shadow text-xl font-medium">{wordCongrat}</p>
                <span className="text-gray-400 text-sm my-10 text-center w-[300px]">You did a great job today for completing your way to build a good habits!</span>
                <Button onClick={overlay.close} className="">
                    Okei
                </Button>
            </div>
        );
    }

    return { show }
}