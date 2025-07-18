# EduLynx Database Backup Information

## Database Backup Files

This repository contains comprehensive database backups for the EduLynx system:

### 1. `lynxacademydb_comprehensive.sql`

- **Purpose**: Complete database schema and data backup
- **Size**: ~60KB
- **Last Updated**: July 17, 2025
- **Contents**:
  - Full PostgreSQL database schema
  - Complete data for all tables
  - 655 students, 49 teachers, 338 parents, 25 classes
  - All authentication credentials and relationships
  - South African CAPS curriculum data

### 2. `lynxacademydb_backup.sql`

- **Purpose**: Full database backup with extended data
- **Size**: ~2.1MB
- **Last Updated**: July 17, 2025
- **Contents**:
  - Complete database dump
  - All user data and educational records
  - Student results and performance data
  - Comprehensive relational data

## Database Restoration

To restore the database from backup:

```bash
# Using comprehensive backup
psql -U lynxacademy -d lynxacademydb < lynxacademydb_comprehensive.sql

# Using full backup
psql -U lynxacademy -d lynxacademydb < lynxacademydb_backup.sql
```

## Database Schema Overview

The database includes the following main entities:

### Core Educational Data

- **Students**: 655 records with demographic and academic information
- **Teachers**: 49 records with subject specializations
- **Parents**: 338 records with student relationships
- **Classes**: 25 classes across different educational phases

### Academic Structure

- **Subjects**: CAPS curriculum subjects (Mathematics, English, Afrikaans, etc.)
- **Grades**: South African educational phases (Foundation, Intermediate,
  Senior)
- **Results**: Student performance data with 7-point achievement levels
- **Attendance**: Student attendance tracking

### System Features

- **Authentication**: JWT-based authentication for all user roles
- **Timetables**: Schedule management for classes and teachers
- **Messages**: Communication system between users
- **Projects**: Academic project management

## Educational Standards Compliance

The database is designed to comply with South African educational standards:

- **CAPS Curriculum**: Curriculum and Assessment Policy Statement integration
- **Achievement Levels**: 7-point scale (Outstanding to Not Achieved)
- **Educational Phases**: Foundation, Intermediate, Senior, and FET phases
- **Subject Classifications**: Aligned with DoE requirements

## Data Security

- All sensitive data is properly encrypted
- Database includes proper indexing for performance
- Foreign key relationships maintain data integrity
- User credentials are securely hashed

## Usage in Development

For development purposes, use the comprehensive backup as it contains all
necessary data for testing the EduLynx system functionality including:

- All user roles (Admin, Teacher, Parent, Student)
- Complete authentication system
- Educational data for dashboard testing
- Relational data for performance analytics

## Backup Schedule

Database backups are updated with each major system enhancement. The current
backups reflect the enhanced dashboard system with South African educational
standards integration completed on July 17, 2025.

## Support

For database restoration issues or questions about the backup files, please
refer to the main EduLynx documentation or contact the development team.
