import { Button } from "@/components/ui/button";
import Lottie from "react-lottie";
import carAnimation from '@/asset/animation/car.json';
import cupAnimation from '@/asset/animation/cup.json';
import doneAnimation from '@/asset/animation/done.json';
import fireAnimation from "@/asset/animation/fire.json";
import { useOverlay } from "@/components/overlay";

const defaultOptions = {
    loop: true,
    autoplay: true,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const JSON_ANIMATIONS = [cupAnimation, carAnimation, doneAnimation, fireAnimation];
export const WORD_CONGRATS = ["Congratulation!", "Awesome Job!", "You Rule!", "Nicely Done!", "You Rocked!", "You are on Fire!", "Woohoo!", "Habits Complete!", "Good Job!"];
export const AFFIRMATIONS = [
    "You're making amazing progress in building those positive habits!",
    "Fantastic effort today! Every step gets you closer to your goal.",
    "Keep up the great work, you're becoming the best version of yourself!",
    "You've done something awesome today by sticking to your habits!",
    "Way to go! Your dedication to self-improvement is inspiring.",
    "You're crushing it! Each day brings you closer to success.",
    "You've proven once again that consistency leads to great results!",
    "Well done! Your determination is shaping your future for the better.",
    "Another day of success! Your hard work is paying off.",
    "You're unstoppable! Keep building those strong, lasting habits.",
    "Great job today! You're truly mastering your routine.",
    "Your dedication is shining through. Keep up the fantastic work!",
    "You're making strides, and it's wonderful to see your growth.",
    "Awesome work today! You're showing incredible discipline.",
    "Keep pushing forward! Your perseverance is leading to amazing outcomes.",
    "You’ve taken another step toward greatness today. Well done!",
    "You’re doing incredible! Your effort today is something to be proud of.",
    "Stay committed! You’re proving that you can achieve anything you set your mind to.",
    "You’ve shown outstanding commitment to your habits today. Keep it going!",
    "Your focus and effort today have set you up for long-term success. Keep shining!"
];


export default function useHabitComplete() {
    const overlay = useOverlay();

    const generateRandom = () => {
        const randomAnimate = JSON_ANIMATIONS[Math.floor(Math.random() * JSON_ANIMATIONS.length)];
        const wordCongrat = WORD_CONGRATS[Math.floor(Math.random() * WORD_CONGRATS.length)];
        const affirmation = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];

        return {
            randomAnimate,
            wordCongrat,
            affirmation,
        }
    }

    const show = () => {

        const { affirmation, randomAnimate, wordCongrat } = generateRandom();

        overlay.showContent(
            <div className="w-full h-full flex flex-col items-center justify-center container-custom">
                <Lottie style={{ pointerEvents: 'none' }} options={{ ...defaultOptions, animationData: randomAnimate }} height={300} width={300} />
                <p className="drop-shadow text-xl font-medium">{wordCongrat}</p>
                <span className="text-gray-400 text-sm my-10 text-center w-[300px]">
                    {affirmation}
                </span>
                <Button onClick={overlay.close} className="">
                    Okei
                </Button>
            </div>
        );
    }

    return { show, generateRandom }
}