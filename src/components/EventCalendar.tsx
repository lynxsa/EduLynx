"use client"
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React from 'react';
import Image from 'next/image';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export interface EventItem {
    id: number;
    title: string;
    time: string;
    description: string;
}

interface EventCalendarProps {
    events?: EventItem[];
}

const events = [
    {
        id:1,
        title: "School Sports Day",
        time: "8:00 AM - 12:00 PM",
        description : "You are invited to participate in the trials for the school's athletics",
    },

    {
        id:2,
        title: "Spelling Competition",
        time: "1:00 PM - 3:00 PM",
        description : "Spelling Bee competition for all grades and ages are welcome to participate",
    },

   /*  {
        id:3,
        title: "Parents Meeting",
        time: "4:00 PM - 6:00 PM",
        description : "All parents are invited to participate in the trials for the school's athletics",
    }, */

  /*   {
        id:4,
        title: "Fundraising",
        time: "11:00 AM - 2:00 PM",
        description : "Help us raise funds for taking the kids to an exciting trip this Summer",
    }, */
]



const EventCalendar = ({ events = [] }: EventCalendarProps) => {
    const [value, onChange] = useState<Value>(new Date());

    return(
        <div className="bg-white p-4 rounded-2xl">
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-6"> Events</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
            </div>
            <div className="flex flex-col gap-4">
                {(events || []).map((event) => (
                    <div className="p-5 rounded-md border-2 border-gray-100-t-4 odd: border-t-LYNXPurple even:border-t-LYNXLight text-xs" key={event.id}>
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold text-gray-600">{event.title}</h1>
                            <span className="text-xs text-gray-400">{event.time}</span>
                        </div>
                        <p className="mt-2 text-gray-600 text-s">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default EventCalendar;