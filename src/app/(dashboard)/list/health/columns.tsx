"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { Heart, AlertTriangle, Activity } from "lucide-react";

// Define the shape of our data
export type HealthRecord = {
  id: string;
  student: {
    name: string;
    surname: string;
    img?: string | null;
  };
  bloodType: string | null;
  allergies: string[];
  conditions: string[];
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  lastCheckupDate?: Date | null;
  notes?: string | null;
};

export const columns: ColumnDef<HealthRecord>[] = [
  {
    accessorKey: "student",
    header: "Student",
    enableSorting: true,
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const student = row.original.student;
      return (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src={student.img || "/noAvatar.png"}
              alt={`${student.name} ${student.surname}`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {`${student.name} ${student.surname}`}
            </p>
            <p className="text-sm text-gray-500">Health Record</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "bloodType",
    header: "Blood Type",
    enableSorting: true,
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const bloodType = row.original.bloodType;
      return (
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {bloodType || "Unknown"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "allergies",
    header: "Allergies",
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const allergies = row.original.allergies;
      return (
        <div className="space-y-1">
          {allergies.length > 0 ? (
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <div className="flex flex-wrap gap-1">
                {allergies.slice(0, 2).map((allergy, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                  >
                    {allergy}
                  </span>
                ))}
                {allergies.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{allergies.length - 2}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">None recorded</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "conditions",
    header: "Medical Conditions",
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const conditions = row.original.conditions;
      return (
        <div className="space-y-1">
          {conditions.length > 0 ? (
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex flex-wrap gap-1">
                {conditions.slice(0, 2).map((condition, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {condition}
                  </span>
                ))}
                {conditions.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{conditions.length - 2}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">None recorded</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emergencyContactName",
    header: "Emergency Contact",
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const contactName = row.original.emergencyContactName;
      const contactPhone = row.original.emergencyContactPhone;
      return (
        <div>
          {contactName ? (
            <div>
              <p className="font-medium text-gray-900">{contactName}</p>
              {contactPhone && (
                <p className="text-sm text-gray-500">{contactPhone}</p>
              )}
            </div>
          ) : (
            <span className="text-gray-500 text-sm">Not provided</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "lastCheckupDate",
    header: "Last Checkup",
    enableSorting: true,
    cell: ({ row }: { row: Row<HealthRecord> }) => {
      const lastCheckup = row.original.lastCheckupDate;
      if (!lastCheckup) {
        return <span className="text-gray-500 text-sm">No record</span>;
      }
      
      const date = new Date(lastCheckup);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const isRecent = diffDays <= 90; // Consider recent if within 3 months
      
      return (
        <div>
          <p className={`font-medium ${isRecent ? 'text-green-600' : 'text-orange-600'}`}>
            {date.toLocaleDateString('en-ZA')}
          </p>
          <p className="text-xs text-gray-500">
            {diffDays} days ago
          </p>
        </div>
      );
    },
  },
];
