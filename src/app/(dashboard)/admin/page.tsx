import CountChart from "@/components/CountChart"
import AttendanceChart from "@/components/AttendanceChart"
import UserCard from "@/components/UserCard"
import FinanceChart from "@/components/FinanceChart"
import EventCalendar from "@/components/EventCalendar"
import Announcements from "@/components/Announcement"


const AdminPage = () => {
    return (
        <div className="p-3 flex gap-4 flex-col md:flex-row">
            {/* Left */}
            <div className="w-full lg:w-2/3 flex flex-col gap-2">
                 {/* User Cards */}
                 <div className="flex gap-3 justify-between flex-wrap">
                     <UserCard type="Students" count={1180} />
                     <UserCard type="Teachers" count={54} />
                     <UserCard type="Parents" count={1900} />
                     <UserCard type="Staff" count={32} />
                </div>
                

            {/* Middle Chart */}
            <div className="flex gap-3 flex-col lg:flex-row pt-4 w-full ">
                    <div className="w-full lg:w-1/3 h-[360px]"><CountChart /></div>
                     <div className="w-full lg:w-2/3 h-[360px]"><AttendanceChart/></div>
            </div>
                   
            {/* Bottom Chart */}
            <div className="flex gap-3 flex-col lg:flex-row pt-4 w-full">
                        <div className="w-full lg:w-3/3 h-[360px]"><FinanceChart/></div>
                   </div>
             </div>

            {/* Left */}
            
            <div className="w-full lg:w-1/3 flex flex-col h-[904px] gap-3 overflow-scroll">
            
                <EventCalendar />
                <Announcements />
            </div>
       
            

        </div>
    )
}

export default AdminPage