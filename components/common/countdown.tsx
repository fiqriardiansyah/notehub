import { hexToRgba } from '@/lib/utils';
import moment from 'moment';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import ReactCountdown from 'react-countdown';
import themeColor from "tailwindcss/colors";

export type CountdownProps = {
    startTime?: any;
    endTime?: any;
    children?: () => any
}

export default function Countdown({ startTime, endTime, children }: CountdownProps) {

    const totalDurationMillis = moment.duration(moment.utc(endTime).diff(moment.utc(startTime))).asMilliseconds();

    function calculateProgress(elapsedMillis: number) {
        let progress = (elapsedMillis / totalDurationMillis) * 100;
        return Math.floor(Math.min(Math.max(progress, 0), 100));
    }

    return (
        <ReactCountdown
            date={endTime}
            renderer={({ hours, minutes, seconds, completed }) => {
                if (completed && children) {
                    return children();
                }

                const currentMilis = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

                const progress = calculateProgress(currentMilis);

                const text = `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "")}`

                return <div className="w-[250px] h-[250px]">
                    <CircularProgressbar text={text} value={progress} styles={buildStyles({
                        textSize: '14px',
                        textColor: hexToRgba("#000000", 0.7),
                        backgroundColor: "#00000000",
                        pathColor: themeColor.gray[700]
                    })} />
                </div>
            }}
        />
    )
}