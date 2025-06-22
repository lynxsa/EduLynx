import Image from 'next/image';
import { useEffect, useState } from 'react';

interface UserCardProps {
  type: string;
  count: number;
}

const UserCard = ({ type, count }: UserCardProps) => {
  return (
    <div className="rounded-2xl odd:bg-LYNXPurple even:bg-LYNXLight text-white p-4 flex-1 gap-4 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white text-black rounded-full font-bold px-2 py-1">
          04 Oct &apos;24
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      {/* Use count dynamically */}
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="text-xs font-medium">{type}</h2>
    </div>
  );
};

export default UserCard;
