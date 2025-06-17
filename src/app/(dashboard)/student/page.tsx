"use client"
import Announcements from "@/components/Announcement"
import BigCalendar from "@/components/BigCalendar"
import EventCalendar from "@/components/EventCalendar"
import "react-big-calendar/lib/css/react-big-calendar.css"

const StudentPage = () => {
    return (
        <div className="p-3 flex gap-4 flex-col xl:flex-row">

    
        {/* Left */}
        <div className="w-full lg:w-2/3 flex flex-col gap-2">
        <div className="h-full bg-white p-4 rounded-2xl ">
        
        <h1 className="text-xl text-center md:text-start font-semibold">Student Time Table (Grade 11A)</h1>
            <BigCalendar/>
        </div>
        </div>


        {/* Right */}
        <div className="w-full lg:w-1/3 flex flex-col h-[904px] gap-3 overflow-scroll">
            <EventCalendar />
            <Announcements />  
        </div>
        </div>

    )
}

export default StudentPage