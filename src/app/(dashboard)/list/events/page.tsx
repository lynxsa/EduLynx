import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { PureComponent } from 'react';
import Link from "next/link";
import { eventsData, role } from "@/lib/data";
import FormModal from "@/components/FormModal";

type Event = {
    id:number;
    title:string;
    class:string;
    date:string;
    startTime:string;
    endTime:string;
   
  
}


const columns=[
    {
          header:"Event Tile", accessor: "title"
    },
  
  
    {
        header:"Class", accessor: "class", className:"table-cell"
    },
  
  
    {
        header:"Date", accessor: "date", className:"hidden md:table-cell"
    },

    {
        header:"Start Time", accessor: "starttime", className:"hidden md:table-cell"
    },
    {
        header:"End Time", accessor: "endtime", className:"hidden md:table-cell"
    },

   
    {
        header:"Actions", accessor: "actions", className:"table-cell"
    }

]



const eventList =() => {

    const renderRow= (item:Event) => (
        <tr key={item.id} className=" border-b-gray-200 p-2 hover:bg-LYNXLavendar even:bg-slate-50 odd:bg-white  ">
            <td className="flex items-center gap-4 p-3">
                <div className="flex rounded-2xl p-1 pr-4">
                   <div className="flex rounded-2xl p-1 pr-4">
                      {item.title}
                  </div>
                </div>
            </td>

            <td className="md:table-cell">{item.class}</td>
            <td className="hidden md:table-cell">{item.date}</td> 
            <td className="md:table-cell">{item.startTime}</td>
            <td className="hidden md:table-cell">{item.endTime}</td>
       
        
        
            <td className="table-cell">
            <div className="flex items-center gap-2">
      
                    <Link href={`/list/events/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight" >
                            <Image src="/view.png" alt="" width={16} height={16} />
                        </button>
                    </Link>


            { role ===  "admin"  && (
                <>
                    <FormModal table ="events" type="update" data={item} /> 
                    <FormModal table ="events" type="delete" id={item.id} /> 
                </>
            )}
            </div>
            </td>
        </tr>
      
 );


    return(
        
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* Top */}
    <div className="flex items-center justify-between">
         <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full md:w-auto">
         <TableSearch/>
            <div className="flex items-center gap-4 self-end">
        
             <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
                   <Image src="/filter.png" alt="" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
                  <Image src="/sort.png" alt="" width={14} height={14}/>
            </button>
            
            { role === "admin" && 
            // button className="w-8 h-8 flex items-center justify-center rounded-full bg-LYNXLavendar">
            //      <Image src="/plus.png" alt="" width={14} height={14}></Image>
            // </button>
            (
            <FormModal table ="events" type="create"/> 

            ) }
    
    </div>
    </div>
    </div>
   

  
    <Table columns={columns} renderRow={renderRow} data={eventsData} />
    <Pagination />


    </div>
    );

    };
    
    


export default eventList