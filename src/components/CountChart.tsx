"use client"
import Image from 'next/image';
import React, { PureComponent } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';



const data = [

  {
    name: 'Total',
    count: 1180,
    fill: '#ffffff',
  },

    {
      name: 'Boys',
      count: 490,
      fill: '#3726a6',
    },
    {
      name: 'Girls',
      count: 690,
      fill: '#a096e7',
    },
   
  ];
  
  const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
  };

const CountChart= () => {
    return(

        <div className="bg-white rounded-2xl w-full h-full p-4">
              {/* Title */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
            </div>

              {/* Chart */}
             <div className="relative w-full h-[70%]">
             <ResponsiveContainer>
                 <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                  <RadialBar
                
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="count" />
               
              </RadialBarChart>
              
             </ResponsiveContainer>
         
             <Image src="/malefemale.png" 
                    alt="" 
                    width={40} 
                    height={40} 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    
              />
            </div>  

              {/* Bottom */}
            <div className="flex justify-center gap-16 pb-8">
              <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-LYNXPurple rounded-full" />
                  <h1 className="font-bold">490</h1>
                  <h2 className="text-xs text-gray-500">Boys 46%</h2>
              </div>

              <div className="flex flex-col gap-1">
                <div className="w-5 h-5 bg-LYNXLight rounded-full" />
                  <h1 className="font-bold">690</h1>
                  <h2 className="text-xs text-gray-500">Girls 58%</h2>
              </div>


              </div>
            </div>

            

    )
}

export default CountChart