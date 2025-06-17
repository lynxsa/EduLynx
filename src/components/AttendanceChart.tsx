"use client"
import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

const data = [
  {
    name: 'Mon',
    Present: 1090,
    Absent: 90,
    
  },
  {
    name: 'Tue',
    Present: 1075,
    Absent: 105,
    
  },
  {
    name: 'Wed',
    Present: 900,
    Absent: 280,
  
  },
  {
    name: 'Thu',
    Present: 705,
    Absent: 475,
  
  },
  {
    name: 'Fri',
    Present: 1070,
    Absent: 110,
  
  },

 
];

const AttendanceChart = () => {
  return(
    <div className="bg-white rounded-2xl p-4 h-full w-full ">
      

      <div className="flex justify-between">
        <div className="">
          <h1 className="text-lg font-semibold">Attendance</h1>
        </div>
        <Image src="/moreDark.png" alt="" width={20} height={20}/>
      </div>


      <div className="w-full h-full pt-3 py-4">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="name" axisLine={false} tick={{fill:"#A9A9A9"}} tickLine={false}/>
          <YAxis axisLine={false}/>
          <Tooltip />
          <Legend align="left" verticalAlign="top" wrapperStyle={{paddingTop:"10px", paddingBottom:"40px"}}/>
          <Bar dataKey="Present" fill="#9370DB" legendType="circle"/>
          <Bar dataKey="Absent" fill="#C0C0C0" legendType="circle"/>
        </BarChart>
      </ResponsiveContainer>




      </div>



    </div>
  )
}



export default AttendanceChart