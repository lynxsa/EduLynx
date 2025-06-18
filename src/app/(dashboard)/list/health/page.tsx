"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MedicalRecord, Student } from "@prisma/client";
import DataTable from "@/components/DataTable"; // Updated to use the new DataTable component
import { columns } from "./columns";

interface MedicalRecordWithStudent extends MedicalRecord {
  student: Pick<Student, "name" | "surname" | "img">;
}

const HealthListPage = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get("/api/health");
        setMedicalRecords(response.data);
      } catch (err) {
        setError("Failed to fetch medical records.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading health records...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <DataTable 
      columns={columns} 
      data={medicalRecords}
      title="Student Health Records"
      description="Comprehensive health information for all students"
      searchPlaceholder="Search health records..."
      onAdd={() => console.log('Add new health record')}
      onEdit={(record) => console.log('Edit health record:', record)}
      onDelete={(record) => console.log('Delete health record:', record)}
      onView={(record) => console.log('View health record:', record)}
    />
  );
};

export default HealthListPage;
