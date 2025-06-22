import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface GenderLineCircleProps {
  male: number;
  female: number;
  small?: boolean;
}

const GenderLineCircle: React.FC<GenderLineCircleProps> = ({ male, female, small = false }) => {
  const total = male + female;
  const malePercent = total ? Math.round((male / total) * 100) : 0;
  const femalePercent = 100 - malePercent;
  return (
    <div
      className={`flex flex-col items-center justify-center ${small ? 'h-24 w-24' : 'h-32 w-32'}`}
      aria-label="Student Gender Distribution"
      role="region"
    >
      <CircularProgressbarWithChildren
        value={malePercent}
        strokeWidth={8}
        styles={buildStyles({
          pathColor: '#6366f1',
          trailColor: '#f472b6',
          strokeLinecap: 'round',
        })}
      >
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-LYNXPurple">{malePercent}%</span>
          <span className="text-xs text-gray-500">Male</span>
        </div>
      </CircularProgressbarWithChildren>
      <span className="text-xs text-pink-400 mt-1">Female: {femalePercent}%</span>
    </div>
  );
};

export default GenderLineCircle;
