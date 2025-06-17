import Announcements from "@/components/Announcement";
import BigCalendar from "@/components/BigCalendar";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";


const SingleTeacherPage = () => {
    return(
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/*  Left */}
            <div className="w-full xl:w-2/3">
             {/*  Top */}
             <div className="flex flex-col lg:flex-row gap-4">
                 {/* User Info Card */}
                  <div className="bg-LYNXLavendar py-6 px-4 rounded-xl flex-1 flex gap-4">
                        {/* Image */}
                        <div className='w-1/3'>
                            <Image src="https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=2" 
                            alt="" 
                            width={144} 
                            height={144} 
                            className="w-36 h-36 rounded-full object-cover"/>
                        </div>
                        {/* Info */}
                        <div className="w-2/3 flex flex-col justify-between gap-4 text-gray-500">
                            <div className="flex items-center gap-6">
                            <h1 className="text-xl font-semibold text-gray-800">Nakedi Leboa</h1>
                            <FormModal
                                table="teacher"
                                type="update"
                                data={{
                                    id: 3,
                                    username: "nakedi.l",
                                    email: "nakedi.leboa@lynxconsulting.co.za",
                                    password: "12920202",
                                    firstname: "Nakedi",
                                    lastname: "Leboa",
                                    phone: "0812338434",
                                    address: "36 Mandela St, Ivory Park, Johannesburg, RSA",
                                    bloodType: "B+",
                                    sex:"Female",
                                    img: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=2",
                                   
                                    
                                }
                            } />
                            </div>
                            <p className="text-sm">A dedicated English, Physics, Biology and Math Teacher with a passion for empowering tomorrow's leaders</p>
                            <div className='flex items-center justify-between gap-2 flex-wrap text-xs font-medium'>
                               
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14} />
                                    <span>Date of Birth : 7 July 1988</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>nakedi.leboa@lynxconsulting.co.za</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span> +27 71 883 4486</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-2/3 flex items-center gap-2">
                                    <Image src="/blood.png" alt="" width={14} height={14} />
                                    <span>Blood Type:A+</span>
                                </div>
                            </div>
                        </div>
                  </div>
                  {/* Small Card */}
                  <div className="flex-1 flex gap-4 justify-between flex-wrap">
                      {/* Card  */}
                      <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleAttendance.png' alt="" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">100%</h1>
                        <span className="text-xs text-gray-500">Attendance</span>
                        </div>
                      </div>
                       {/* Card  */}
                       <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleBranch.png' alt="" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">3</h1>
                        <span className="text-xs text-gray-500">Subjects</span>
                        </div>
                      </div>
                        {/* Card  */}
                        <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleLesson.png' alt="" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">6</h1>
                        <span className="text-xs text-gray-500">Lessons Per day</span>
                        </div>
                      </div>

                       {/* Card  */}
                       <div className="bg-slate-200 p-4 rounded-md gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleClass.png' alt="" width={24} height={40} className="w-6 h-6" />
                        <div className="">
                        <h1 className="text-xl font-semibold">6</h1>
                        <span className="text-xs text-gray-500">Classes</span>
                        </div>
                      </div>



                        
                  </div>
              </div>

              {/* Bottom */}
              <div className="mt-4 bg-slate-100 rounded-md p-4 h-[800px]">
                <h1> Teacher's Sechedule</h1> 
                <BigCalendar/>
              </div>

            </div>

            {/*  Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-slate-100 p-4 rounded-xl">
                <h1 className="text-xl font-semibold">Shortcuts</h1>
                <div className="mt-4 flex gap-4 flex-wrap text-xs text-white p-2">
                    <Link className="bg-LYNXPurple rounded-xl" href="/"><p className="p-2">Teacher's Classes</p></Link>
                    <Link className="bg-LYNXMauve rounded-xl" href="/"><p className="p-2">Teacher's Students</p></Link>
                    <Link className="bg-LYNXThistle rounded-xl" href="/"><p className="p-2">Teacher's Lessons</p></Link>
                    <Link className="bg-LYNXHelio rounded-xl" href="/"><p className="p-2">Teacher's Exams</p></Link>
                    <Link className="bg-LYNXLight rounded-xl" href="/"><p className="p-2">Teacher's Assignments</p></Link>
            </div>

            
            <Performance/>
            <Announcements/>
       
            
            
            </div>
        </div>
        </div>
    )
}



export default SingleTeacherPage;