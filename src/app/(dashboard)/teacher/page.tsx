"use client"
import Announcements from "@/components/Announcement"
import BigCalendar from "@/components/BigCalendar"
import EventCalendar from "@/components/EventCalendar"


const TeacherPage = () => {
    return (
        <div className="p-3 flex gap-4 flex-col xl:flex-row">

    
        {/* Left */}
        <div className="w-full lg:w-2/3 flex flex-col gap-2">
        <div className="h-full bg-white p-4 rounded-2xl ">
        <h1 className="text-xl text-center md:text-start font-semibold">Teacher's Schedule</h1>
            <BigCalendar/>
        </div>
        </div>


        {/* Right */}
        <div className="w-full lg:w-1/3 flex flex-col h-[904px] gap-3 overflow-scroll">
            <Announcements /> 
            <EventCalendar />     
        </div>
        </div>

    )
}

export default TeacherPage