const Table = ({
    columns,
    renderRow,
    data
}:
    {columns:{header:string; accessor:string; className?:string}[];
    renderRow: (item:any) => React.ReactNode;
    data : any[];
}) =>
{
    return(
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left text-gray-400 text-xs">
                    {columns.map((col)=>(
                        <th key={col.accessor}className={col.className}>{col.header}</th>
                    ))}
                </tr>      
            </thead>
            <tbody className="text-left text-gray-700 text-xs">
                {data.map((item) => renderRow(item))}
            </tbody>
        </table>
       
    )
};

export default Table