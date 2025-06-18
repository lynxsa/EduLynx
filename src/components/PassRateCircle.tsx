import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface PassRateCircleProps {
  value: number;
  label?: string;
  color?: string;
}

const PassRateCircle = ({ value, label = 'Pass Rate', color = '#6366f1' }: PassRateCircleProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-32 w-32 animate-fade-in">
      <div data-tooltip-id="passrate-circle-tooltip" data-tooltip-content={`Current pass rate: ${value}%. Target: 85%+`}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: value >= 85 ? '#10b981' : value >= 70 ? color : '#ef4444',
            textColor: value >= 85 ? '#10b981' : value >= 70 ? color : '#ef4444',
            trailColor: '#e5e7eb',
            textSize: '1.5rem',
            pathTransitionDuration: 1.5,
          })}
        />
      </div>
      <span className="mt-2 text-xs text-gray-500">{label}</span>
    </div>
  );
};

export default PassRateCircle;
