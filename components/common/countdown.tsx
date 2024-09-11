import moment from 'moment';
import ReactCountdown from 'react-countdown';

export type CountdownProps = {
    startTime?: any;
    endTime?: any;
    onCompleteRender?: () => any;
    children: (dt: { text: string, progress: number }) => any;
}

export default function Countdown({ startTime, endTime, onCompleteRender, children }: CountdownProps) {

    const totalDurationMillis = moment.duration(moment.utc(endTime).diff(moment.utc(startTime))).asMilliseconds();

    function calculateProgress(elapsedMillis: number) {
        let progress = (elapsedMillis / totalDurationMillis) * 100;
        return Math.floor(Math.min(Math.max(progress, 0), 100));
    }

    return (
        <ReactCountdown
            date={endTime}
            renderer={({ hours, minutes, seconds, completed }) => {
                if (completed && onCompleteRender) {
                    return onCompleteRender();
                }

                const currentMilis = hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

                const progress = calculateProgress(currentMilis);

                const text = `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "")}`

                return children({ text, progress });
            }}
        />
    )
}