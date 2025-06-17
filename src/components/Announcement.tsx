import React, { PureComponent } from 'react';
import Image from 'next/image';


const announcements = [
    {
        id:1,
        title: "New Grade8 English Teacher!",
        time: "11:30 PM",
        description : "We welcome Mrs R.Sebopa as our new English Teacher",
    },

    {
        id:2,
        title: "No Soccer Practice 12 Oct",
        time: "1:00 PM",
        description : "Please note there is no soccer practice on 12 Oct 2024",
    },

    {
        id:3,
        title: "Parents Meeting Today ",
        time: "4:00 PM",
        description : "All parents are invited to participate in the trials for the school's athletics",
    },

  {
        id:4,
        title: "Fundraising",
        time: "11:00 AM - 2:00 PM",
        description : "Help us raise funds for taking the kids to an exciting trip this Summer",
    }, 
]


const Announcements =() => {
return(
    <div className="bg-white p-3 rounded-2xl">


        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold my-4"> Announcements</h1>
            <span className="text-xs text-gray-500">View All</span>
        </div>

        <div className="flex flex-col gap-4">
        {announcements.map((announcement)=>
        (
            <div className="p-5 rounded-md border-2 border-gray-100-t-4 odd: border-l-LYNXPurple even:border-t-LYNXLight text-xs" key={announcement.id}>
                <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-600">{announcement.title}</div>
                    <span className="text-xs text-gray-400">{announcement.time}</span>  
                </div>
                <p className="text-s text-gray-400">{announcement.description}</p>
            </div>

        ))}

        </div>

    </div>
);
};


export default Announcements