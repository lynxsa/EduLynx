import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Table from "@/components/Table";
import React, { PureComponent } from 'react';
import Link from "next/link";
import { role, studentsData, teachersData } from "@/lib/data";
import FormModal from "@/components/FormModal";

type Student = {
    id:number;
    studentId:string;
    name:string;
    email:string;
    photo:string;
    phone:string;
    grade:number;
    class:string;
    address:string;
  
}


const columns=[
    {
        header:"Info", accessor: "info"
    },

    {
        header:"StudentID", accessor: "studentId", className:"hidden md:table-cell"
    },
    {
        header:"Grade", accessor: "grade", className:"hidden md:table-cell"
    },

    {
        header:"Class", accessor: "class", className:"hidden md:table-cell"
    },

    {
        header:"Phone", accessor: "phone", className:"hidden lg:table-cell"
    },

    {
        header:"Address", accessor: "address", className:"hidden lg:table-cell"
    },
    {
        header:"Actions", accessor: "actions", className:"hidden lg:table-cell"
    }

]



const TeacherList =() => {

    const renderRow= (item:Student) => (
        <tr key={item.id} className="rounded-3xl border-b-gray-200 hover:bg-LYNXLavendar even:bg-slate-50  odd:bg-white  ">
            <td className="flex items-center gap-4 p-3">
                <div className="flex rounded-2xl p-2 pr-4">
                    <div className="flex mr-1">
                <Image src={item.photo} alt="" width={30} height={30} className="rounded-full"/>
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">{item.name}</div>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.studentId}</td>
            <td className="hidden md:table-cell">{item.grade}</td>
            <td className="hidden md:table-cell">{item.class}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
            <td className="table-cell">
                <div className='flex items-center gap-2'>
                    <Link href={`/list/students/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-LYNXLight" >
                            <Image src="/view.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                   
            { role === "admin"  && (
                <>
                   <FormModal table ="students" type="update" data={item} />
                   <FormModal table ="students" type="delete" id={item.id} />
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
         <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
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
            <FormModal table ="students" type="create" /> 

            ) }
    
    
    </div>
    </div>
    </div>
   

  
    <Table columns={columns} renderRow={renderRow} data={studentsData} />
    <Pagination page={1} count={studentsData.length} />


    </div>
    );

    };
    
    


export default TeacherList