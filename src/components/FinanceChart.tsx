"use client"
import Image from 'next/image';
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  {
    name: 'Jan',
    income: 4000,
    expense: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    income: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    name: 'Mar',
    income: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    name: 'Apr',
    income: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    name: 'May',
    income: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    name: 'Jun',
    income: 2390,
    expense: 3800,
    amt: 2500,
  },
  {
    name: 'Jul',
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    name: 'Aug',
    income: 2780,
    expense: 3908,
   
  },
  {
    name: 'Sep',
    income: 1890,
    expense: 4800,
   
  },
  {
    name: 'Oct',
    income: 2390,
    expense: 3800,
  
  },
  {
    name: 'Nov',
    income: 3490,
    expense: 4300,
 
  },
  {
    name: 'Dec',
    income: 3490,
    expense: 4300,
   
  },
];


const FinanceChart= () => {



    return(
        <div className="bg-white rounded-2xl w-full h-full p-8">
        <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finances</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20}/>
    </div>


    <div className="w-full h-full pt-8">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} />
          <YAxis tickLine={false}  />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      </div>

            

        </div>
    )
}

export default FinanceChart