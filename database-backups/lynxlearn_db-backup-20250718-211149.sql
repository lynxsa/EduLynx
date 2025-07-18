--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Debian 14.18-1.pgdg120+1)
-- Dumped by pg_dump version 14.18 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Day; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."Day" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
);


ALTER TYPE public."Day" OWNER TO lynxlearn_admin;

--
-- Name: FinanceType; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."FinanceType" AS ENUM (
    'Income',
    'Expense'
);


ALTER TYPE public."FinanceType" OWNER TO lynxlearn_admin;

--
-- Name: MessagePriority; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."MessagePriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH'
);


ALTER TYPE public."MessagePriority" OWNER TO lynxlearn_admin;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."MessageType" AS ENUM (
    'INBOX',
    'SENT',
    'ARCHIVED'
);


ALTER TYPE public."MessageType" OWNER TO lynxlearn_admin;

--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PLANNING',
    'IN_PROGRESS',
    'COMPLETED',
    'SUBMITTED',
    'GRADED'
);


ALTER TYPE public."ProjectStatus" OWNER TO lynxlearn_admin;

--
-- Name: ProjectType; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."ProjectType" AS ENUM (
    'INDIVIDUAL',
    'GROUP',
    'CLASS'
);


ALTER TYPE public."ProjectType" OWNER TO lynxlearn_admin;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLE_CHOICE',
    'TRUE_FALSE',
    'SHORT_ANSWER'
);


ALTER TYPE public."QuestionType" OWNER TO lynxlearn_admin;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'TEACHER',
    'STUDENT',
    'PARENT'
);


ALTER TYPE public."UserRole" OWNER TO lynxlearn_admin;

--
-- Name: UserSex; Type: TYPE; Schema: public; Owner: lynxlearn_admin
--

CREATE TYPE public."UserSex" AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public."UserSex" OWNER TO lynxlearn_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public."Admin" OWNER TO lynxlearn_admin;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Announcement" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "classId" integer
);


ALTER TABLE public."Announcement" OWNER TO lynxlearn_admin;

--
-- Name: Announcement_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Announcement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Announcement_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Announcement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Announcement_id_seq" OWNED BY public."Announcement".id;


--
-- Name: Answer; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Answer" (
    id integer NOT NULL,
    "attemptId" integer NOT NULL,
    "questionId" integer NOT NULL,
    response text NOT NULL,
    "isCorrect" boolean
);


ALTER TABLE public."Answer" OWNER TO lynxlearn_admin;

--
-- Name: Answer_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Answer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Answer_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Answer_id_seq" OWNED BY public."Answer".id;


--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Assignment" (
    id integer NOT NULL,
    title text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    "lessonId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Assignment" OWNER TO lynxlearn_admin;

--
-- Name: Assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Assignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Assignment_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Assignment_id_seq" OWNED BY public."Assignment".id;


--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Attendance" (
    id integer NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    present boolean NOT NULL,
    "studentId" text NOT NULL,
    "lessonId" integer NOT NULL
);


ALTER TABLE public."Attendance" OWNER TO lynxlearn_admin;

--
-- Name: Attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Attendance_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Attendance_id_seq" OWNED BY public."Attendance".id;


--
-- Name: Class; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Class" (
    id integer NOT NULL,
    name text NOT NULL,
    capacity integer NOT NULL,
    "supervisorId" text,
    "gradeId" integer,
    "schoolId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "classTeacher" text,
    "roomNumber" text,
    timetable text
);


ALTER TABLE public."Class" OWNER TO lynxlearn_admin;

--
-- Name: Class_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Class_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Class_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Class_id_seq" OWNED BY public."Class".id;


--
-- Name: Event; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Event" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "classId" integer
);


ALTER TABLE public."Event" OWNER TO lynxlearn_admin;

--
-- Name: Event_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Event_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Event_id_seq" OWNED BY public."Event".id;


--
-- Name: Exam; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Exam" (
    id integer NOT NULL,
    title text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "lessonId" integer NOT NULL
);


ALTER TABLE public."Exam" OWNER TO lynxlearn_admin;

--
-- Name: Exam_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Exam_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Exam_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Exam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Exam_id_seq" OWNED BY public."Exam".id;


--
-- Name: FinanceEntry; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."FinanceEntry" (
    id text NOT NULL,
    title text NOT NULL,
    amount double precision NOT NULL,
    type public."FinanceType" NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category text,
    "linkedParentId" text,
    "linkedStudentId" text,
    notes text,
    reference text
);


ALTER TABLE public."FinanceEntry" OWNER TO lynxlearn_admin;

--
-- Name: Grade; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Grade" (
    id integer NOT NULL,
    level integer NOT NULL,
    "schoolId" integer
);


ALTER TABLE public."Grade" OWNER TO lynxlearn_admin;

--
-- Name: Grade_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Grade_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Grade_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Grade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Grade_id_seq" OWNED BY public."Grade".id;


--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Lesson" (
    id integer NOT NULL,
    name text NOT NULL,
    day public."Day" NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "subjectId" integer NOT NULL,
    "classId" integer NOT NULL,
    "teacherId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Lesson" OWNER TO lynxlearn_admin;

--
-- Name: Lesson_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Lesson_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Lesson_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Lesson_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Lesson_id_seq" OWNED BY public."Lesson".id;


--
-- Name: MedicalRecord; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."MedicalRecord" (
    id text NOT NULL,
    "studentId" text NOT NULL,
    "bloodType" text,
    allergies text[],
    medications text[],
    conditions text[],
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    "emergencyContactRelationship" text,
    "doctorName" text,
    "doctorPhone" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MedicalRecord" OWNER TO lynxlearn_admin;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    subject text NOT NULL,
    content text NOT NULL,
    preview text NOT NULL,
    "fromId" text NOT NULL,
    "toId" text NOT NULL,
    priority public."MessagePriority" DEFAULT 'NORMAL'::public."MessagePriority" NOT NULL,
    type public."MessageType" DEFAULT 'INBOX'::public."MessageType" NOT NULL,
    read boolean DEFAULT false NOT NULL,
    starred boolean DEFAULT false NOT NULL,
    archived boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO lynxlearn_admin;

--
-- Name: Option; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Option" (
    id integer NOT NULL,
    "questionId" integer NOT NULL,
    text text NOT NULL
);


ALTER TABLE public."Option" OWNER TO lynxlearn_admin;

--
-- Name: Option_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Option_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Option_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Option_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Option_id_seq" OWNED BY public."Option".id;


--
-- Name: Parent; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Parent" (
    id text NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    img text,
    sex public."UserSex" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "schoolId" integer,
    "userId" text,
    employer text,
    occupation text,
    "relationshipToStudent" text
);


ALTER TABLE public."Parent" OWNER TO lynxlearn_admin;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    type public."ProjectType" NOT NULL,
    status public."ProjectStatus" DEFAULT 'PLANNING'::public."ProjectStatus" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    grade integer,
    feedback text,
    requirements text,
    resources text,
    "subjectId" integer,
    "classId" integer,
    "teacherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Project" OWNER TO lynxlearn_admin;

--
-- Name: Question; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Question" (
    id integer NOT NULL,
    "quizId" integer NOT NULL,
    prompt text NOT NULL,
    type public."QuestionType" NOT NULL,
    answer text
);


ALTER TABLE public."Question" OWNER TO lynxlearn_admin;

--
-- Name: Question_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Question_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Question_id_seq" OWNED BY public."Question".id;


--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Quiz" (
    id integer NOT NULL,
    title text NOT NULL,
    "lessonId" integer NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Quiz" OWNER TO lynxlearn_admin;

--
-- Name: QuizAttempt; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."QuizAttempt" (
    id integer NOT NULL,
    "quizId" integer NOT NULL,
    "studentId" text NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    score integer,
    feedback text
);


ALTER TABLE public."QuizAttempt" OWNER TO lynxlearn_admin;

--
-- Name: QuizAttempt_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."QuizAttempt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."QuizAttempt_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: QuizAttempt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."QuizAttempt_id_seq" OWNED BY public."QuizAttempt".id;


--
-- Name: Quiz_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Quiz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Quiz_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Quiz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Quiz_id_seq" OWNED BY public."Quiz".id;


--
-- Name: Result; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Result" (
    id integer NOT NULL,
    score integer NOT NULL,
    "examId" integer,
    "assignmentId" integer,
    "studentId" text NOT NULL
);


ALTER TABLE public."Result" OWNER TO lynxlearn_admin;

--
-- Name: Result_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Result_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Result_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Result_id_seq" OWNED BY public."Result".id;


--
-- Name: School; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."School" (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    country text NOT NULL,
    logo text,
    motto text,
    principal text,
    "registrationNumber" text,
    "schoolType" text,
    website text
);


ALTER TABLE public."School" OWNER TO lynxlearn_admin;

--
-- Name: School_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."School_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."School_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: School_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."School_id_seq" OWNED BY public."School".id;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    img text,
    "bloodType" text NOT NULL,
    sex public."UserSex" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    birthday timestamp(3) without time zone NOT NULL,
    "parentId" text,
    "classId" integer,
    "gradeId" integer,
    "schoolId" integer,
    "userId" text,
    "admissionYear" integer,
    allergies text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    extracurriculars text,
    gender text NOT NULL,
    "guardianRelationship" text,
    "homeLanguage" text,
    "medicalInfo" text,
    "profileImage" text,
    "specialNeeds" text,
    status text
);


ALTER TABLE public."Student" OWNER TO lynxlearn_admin;

--
-- Name: StudentSubject; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."StudentSubject" (
    id integer NOT NULL,
    "studentId" text NOT NULL,
    "subjectId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."StudentSubject" OWNER TO lynxlearn_admin;

--
-- Name: StudentSubject_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."StudentSubject_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StudentSubject_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: StudentSubject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."StudentSubject_id_seq" OWNED BY public."StudentSubject".id;


--
-- Name: Subject; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Subject" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Subject" OWNER TO lynxlearn_admin;

--
-- Name: Subject_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Subject_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Subject_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Subject_id_seq" OWNED BY public."Subject".id;


--
-- Name: Submission; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Submission" (
    id integer NOT NULL,
    "assignmentId" integer NOT NULL,
    "studentId" text NOT NULL,
    "fileUrl" text,
    text text,
    "submittedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    grade integer,
    feedback text
);


ALTER TABLE public."Submission" OWNER TO lynxlearn_admin;

--
-- Name: Submission_id_seq; Type: SEQUENCE; Schema: public; Owner: lynxlearn_admin
--

CREATE SEQUENCE public."Submission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Submission_id_seq" OWNER TO lynxlearn_admin;

--
-- Name: Submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lynxlearn_admin
--

ALTER SEQUENCE public."Submission_id_seq" OWNED BY public."Submission".id;


--
-- Name: Teacher; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."Teacher" (
    id text NOT NULL,
    username text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    img text,
    "bloodType" text NOT NULL,
    sex public."UserSex" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    birthday timestamp(3) without time zone NOT NULL,
    "classId" integer,
    "schoolId" integer,
    "userId" text,
    "employmentStatus" text,
    gender text,
    "idNumber" text,
    nationality text,
    "nextOfKinName" text,
    "nextOfKinPhone" text,
    qualifications text,
    "yearsExperience" integer
);


ALTER TABLE public."Teacher" OWNER TO lynxlearn_admin;

--
-- Name: User; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "preferredName" text,
    "dateOfBirth" timestamp(3) without time zone,
    gender text,
    phone text,
    "addressLine1" text,
    "addressLine2" text,
    city text,
    province text,
    "postalCode" text,
    country text DEFAULT 'South Africa'::text NOT NULL,
    role public."UserRole" NOT NULL,
    "schoolId" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO lynxlearn_admin;

--
-- Name: _ProjectStudents; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."_ProjectStudents" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProjectStudents" OWNER TO lynxlearn_admin;

--
-- Name: _SubjectToTeacher; Type: TABLE; Schema: public; Owner: lynxlearn_admin
--

CREATE TABLE public."_SubjectToTeacher" (
    "A" integer NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_SubjectToTeacher" OWNER TO lynxlearn_admin;

--
-- Name: Announcement id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Announcement" ALTER COLUMN id SET DEFAULT nextval('public."Announcement_id_seq"'::regclass);


--
-- Name: Answer id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Answer" ALTER COLUMN id SET DEFAULT nextval('public."Answer_id_seq"'::regclass);


--
-- Name: Assignment id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Assignment" ALTER COLUMN id SET DEFAULT nextval('public."Assignment_id_seq"'::regclass);


--
-- Name: Attendance id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Attendance" ALTER COLUMN id SET DEFAULT nextval('public."Attendance_id_seq"'::regclass);


--
-- Name: Class id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Class" ALTER COLUMN id SET DEFAULT nextval('public."Class_id_seq"'::regclass);


--
-- Name: Event id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Event" ALTER COLUMN id SET DEFAULT nextval('public."Event_id_seq"'::regclass);


--
-- Name: Exam id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Exam" ALTER COLUMN id SET DEFAULT nextval('public."Exam_id_seq"'::regclass);


--
-- Name: Grade id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Grade" ALTER COLUMN id SET DEFAULT nextval('public."Grade_id_seq"'::regclass);


--
-- Name: Lesson id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Lesson" ALTER COLUMN id SET DEFAULT nextval('public."Lesson_id_seq"'::regclass);


--
-- Name: Option id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Option" ALTER COLUMN id SET DEFAULT nextval('public."Option_id_seq"'::regclass);


--
-- Name: Question id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Question" ALTER COLUMN id SET DEFAULT nextval('public."Question_id_seq"'::regclass);


--
-- Name: Quiz id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Quiz" ALTER COLUMN id SET DEFAULT nextval('public."Quiz_id_seq"'::regclass);


--
-- Name: QuizAttempt id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."QuizAttempt" ALTER COLUMN id SET DEFAULT nextval('public."QuizAttempt_id_seq"'::regclass);


--
-- Name: Result id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Result" ALTER COLUMN id SET DEFAULT nextval('public."Result_id_seq"'::regclass);


--
-- Name: School id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."School" ALTER COLUMN id SET DEFAULT nextval('public."School_id_seq"'::regclass);


--
-- Name: StudentSubject id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."StudentSubject" ALTER COLUMN id SET DEFAULT nextval('public."StudentSubject_id_seq"'::regclass);


--
-- Name: Subject id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Subject" ALTER COLUMN id SET DEFAULT nextval('public."Subject_id_seq"'::regclass);


--
-- Name: Submission id; Type: DEFAULT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Submission" ALTER COLUMN id SET DEFAULT nextval('public."Submission_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Admin" (id, username) FROM stdin;
\.


--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Announcement" (id, title, description, date, "classId") FROM stdin;
\.


--
-- Data for Name: Answer; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Answer" (id, "attemptId", "questionId", response, "isCorrect") FROM stdin;
\.


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Assignment" (id, title, "startDate", "dueDate", "lessonId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Attendance" (id, date, present, "studentId", "lessonId") FROM stdin;
\.


--
-- Data for Name: Class; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Class" (id, name, capacity, "supervisorId", "gradeId", "schoolId", "createdAt", "updatedAt", "classTeacher", "roomNumber", timetable) FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Event" (id, title, description, "startTime", "endTime", "classId") FROM stdin;
\.


--
-- Data for Name: Exam; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Exam" (id, title, "startTime", "endTime", "lessonId") FROM stdin;
\.


--
-- Data for Name: FinanceEntry; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."FinanceEntry" (id, title, amount, type, date, "createdAt", category, "linkedParentId", "linkedStudentId", notes, reference) FROM stdin;
\.


--
-- Data for Name: Grade; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Grade" (id, level, "schoolId") FROM stdin;
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Lesson" (id, name, day, "startTime", "endTime", "subjectId", "classId", "teacherId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MedicalRecord; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."MedicalRecord" (id, "studentId", "bloodType", allergies, medications, conditions, "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship", "doctorName", "doctorPhone", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Message" (id, subject, content, preview, "fromId", "toId", priority, type, read, starred, archived, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Option; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Option" (id, "questionId", text) FROM stdin;
\.


--
-- Data for Name: Parent; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Parent" (id, username, name, surname, email, phone, address, img, sex, "createdAt", "schoolId", "userId", employer, occupation, "relationshipToStudent") FROM stdin;
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Project" (id, title, description, type, status, "startDate", "dueDate", grade, feedback, requirements, resources, "subjectId", "classId", "teacherId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Question" (id, "quizId", prompt, type, answer) FROM stdin;
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Quiz" (id, title, "lessonId", "startDate", "endDate") FROM stdin;
\.


--
-- Data for Name: QuizAttempt; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."QuizAttempt" (id, "quizId", "studentId", "startedAt", "submittedAt", score, feedback) FROM stdin;
\.


--
-- Data for Name: Result; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Result" (id, score, "examId", "assignmentId", "studentId") FROM stdin;
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."School" (id, name, address, city, province, country, logo, motto, principal, "registrationNumber", "schoolType", website) FROM stdin;
1	LynxLearn Academy	123 Education Street	Cape Town	Western Cape	South Africa	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Student" (id, username, name, surname, email, phone, address, img, "bloodType", sex, "createdAt", birthday, "parentId", "classId", "gradeId", "schoolId", "userId", "admissionYear", allergies, "emergencyContactName", "emergencyContactPhone", extracurriculars, gender, "guardianRelationship", "homeLanguage", "medicalInfo", "profileImage", "specialNeeds", status) FROM stdin;
\.


--
-- Data for Name: StudentSubject; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."StudentSubject" (id, "studentId", "subjectId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Subject" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Submission" (id, "assignmentId", "studentId", "fileUrl", text, "submittedAt", grade, feedback) FROM stdin;
\.


--
-- Data for Name: Teacher; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."Teacher" (id, username, name, surname, email, phone, address, img, "bloodType", sex, "createdAt", birthday, "classId", "schoolId", "userId", "employmentStatus", gender, "idNumber", nationality, "nextOfKinName", "nextOfKinPhone", qualifications, "yearsExperience") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."User" (id, email, password, "firstName", "lastName", "preferredName", "dateOfBirth", gender, phone, "addressLine1", "addressLine2", city, province, "postalCode", country, role, "schoolId", "isActive", "createdAt", "updatedAt") FROM stdin;
admin-1	admin@lynxlearn.co.za	$2b$12$fVoXWr5UDczgDdhRN9PRdezmI7fvqYpUpAXII2xRYXyvF1Tmj8Udi	Admin	User	\N	\N	\N	\N	\N	\N	\N	\N	\N	South Africa	ADMIN	1	t	2025-07-18 17:24:11.02	2025-07-18 17:24:11.018
teacher-1	teacher@lynxlearn.co.za	$2b$12$mF1rjHsTg75TdxGKEsagmOSHeIKyzQeil1oPLISVJRoBATpDNuoa6	John	Teacher	\N	\N	\N	\N	\N	\N	\N	\N	\N	South Africa	TEACHER	1	t	2025-07-18 17:24:11.027	2025-07-18 17:24:11.026
student-1	student@lynxlearn.co.za	$2b$12$dQBAYCvuaEyLdZLv1ov8Seki.YoxJjb5z4jiFHltB4zCJvgyBefcO	Jane	Student	\N	\N	\N	\N	\N	\N	\N	\N	\N	South Africa	STUDENT	1	t	2025-07-18 17:24:11.03	2025-07-18 17:24:11.029
\.


--
-- Data for Name: _ProjectStudents; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."_ProjectStudents" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _SubjectToTeacher; Type: TABLE DATA; Schema: public; Owner: lynxlearn_admin
--

COPY public."_SubjectToTeacher" ("A", "B") FROM stdin;
\.


--
-- Name: Announcement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Announcement_id_seq"', 1, false);


--
-- Name: Answer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Answer_id_seq"', 1, false);


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 1, false);


--
-- Name: Attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Attendance_id_seq"', 1, false);


--
-- Name: Class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Class_id_seq"', 1, false);


--
-- Name: Event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Event_id_seq"', 1, false);


--
-- Name: Exam_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Exam_id_seq"', 1, false);


--
-- Name: Grade_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Grade_id_seq"', 1, false);


--
-- Name: Lesson_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Lesson_id_seq"', 1, false);


--
-- Name: Option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Option_id_seq"', 1, false);


--
-- Name: Question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Question_id_seq"', 1, false);


--
-- Name: QuizAttempt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."QuizAttempt_id_seq"', 1, false);


--
-- Name: Quiz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Quiz_id_seq"', 1, false);


--
-- Name: Result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Result_id_seq"', 1, false);


--
-- Name: School_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."School_id_seq"', 1, false);


--
-- Name: StudentSubject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."StudentSubject_id_seq"', 1, false);


--
-- Name: Subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Subject_id_seq"', 1, false);


--
-- Name: Submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lynxlearn_admin
--

SELECT pg_catalog.setval('public."Submission_id_seq"', 1, false);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: Answer Answer_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_pkey" PRIMARY KEY (id);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Exam Exam_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_pkey" PRIMARY KEY (id);


--
-- Name: FinanceEntry FinanceEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."FinanceEntry"
    ADD CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY (id);


--
-- Name: Grade Grade_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Grade"
    ADD CONSTRAINT "Grade_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: MedicalRecord MedicalRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."MedicalRecord"
    ADD CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Option Option_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Option"
    ADD CONSTRAINT "Option_pkey" PRIMARY KEY (id);


--
-- Name: Parent Parent_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: QuizAttempt QuizAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY (id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- Name: Result Result_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_pkey" PRIMARY KEY (id);


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: StudentSubject StudentSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."StudentSubject"
    ADD CONSTRAINT "StudentSubject_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: Submission Submission_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);


--
-- Name: Teacher Teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _SubjectToTeacher _SubjectToTeacher_pkey; Type: CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."_SubjectToTeacher"
    ADD CONSTRAINT "_SubjectToTeacher_pkey" PRIMARY KEY ("A", "B");


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- Name: Class_name_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Class_name_key" ON public."Class" USING btree (name);


--
-- Name: Grade_level_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Grade_level_key" ON public."Grade" USING btree (level);


--
-- Name: MedicalRecord_studentId_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "MedicalRecord_studentId_key" ON public."MedicalRecord" USING btree ("studentId");


--
-- Name: Message_createdAt_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Message_createdAt_idx" ON public."Message" USING btree ("createdAt");


--
-- Name: Message_fromId_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Message_fromId_idx" ON public."Message" USING btree ("fromId");


--
-- Name: Message_toId_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Message_toId_idx" ON public."Message" USING btree ("toId");


--
-- Name: Parent_email_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Parent_email_key" ON public."Parent" USING btree (email);


--
-- Name: Parent_phone_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Parent_phone_key" ON public."Parent" USING btree (phone);


--
-- Name: Parent_userId_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Parent_userId_key" ON public."Parent" USING btree ("userId");


--
-- Name: Parent_username_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Parent_username_key" ON public."Parent" USING btree (username);


--
-- Name: Project_classId_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Project_classId_idx" ON public."Project" USING btree ("classId");


--
-- Name: Project_dueDate_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Project_dueDate_idx" ON public."Project" USING btree ("dueDate");


--
-- Name: Project_status_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Project_status_idx" ON public."Project" USING btree (status);


--
-- Name: Project_subjectId_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Project_subjectId_idx" ON public."Project" USING btree ("subjectId");


--
-- Name: Project_teacherId_idx; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "Project_teacherId_idx" ON public."Project" USING btree ("teacherId");


--
-- Name: School_name_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "School_name_key" ON public."School" USING btree (name);


--
-- Name: StudentSubject_studentId_subjectId_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "StudentSubject_studentId_subjectId_key" ON public."StudentSubject" USING btree ("studentId", "subjectId");


--
-- Name: Student_email_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Student_email_key" ON public."Student" USING btree (email);


--
-- Name: Student_phone_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Student_phone_key" ON public."Student" USING btree (phone);


--
-- Name: Student_userId_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Student_userId_key" ON public."Student" USING btree ("userId");


--
-- Name: Student_username_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Student_username_key" ON public."Student" USING btree (username);


--
-- Name: Subject_name_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Subject_name_key" ON public."Subject" USING btree (name);


--
-- Name: Teacher_email_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Teacher_email_key" ON public."Teacher" USING btree (email);


--
-- Name: Teacher_phone_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Teacher_phone_key" ON public."Teacher" USING btree (phone);


--
-- Name: Teacher_userId_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Teacher_userId_key" ON public."Teacher" USING btree ("userId");


--
-- Name: Teacher_username_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "Teacher_username_key" ON public."Teacher" USING btree (username);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _ProjectStudents_AB_unique; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE UNIQUE INDEX "_ProjectStudents_AB_unique" ON public."_ProjectStudents" USING btree ("A", "B");


--
-- Name: _ProjectStudents_B_index; Type: INDEX; Schema: public; Owner: lynxlearn_admin
--

CREATE INDEX "_ProjectStudents_B_index" ON public."_ProjectStudents" USING btree ("B");


--
-- Name: Announcement Announcement_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Answer Answer_attemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES public."QuizAttempt"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Answer Answer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Answer"
    ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attendance Attendance_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attendance Attendance_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Class Class_gradeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES public."Grade"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Class Class_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Class Class_supervisorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Event Event_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Exam Exam_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Exam"
    ADD CONSTRAINT "Exam_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Grade Grade_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Grade"
    ADD CONSTRAINT "Grade_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lesson Lesson_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MedicalRecord MedicalRecord_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."MedicalRecord"
    ADD CONSTRAINT "MedicalRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_fromId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_toId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Option Option_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Option"
    ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Parent Parent_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Parent Parent_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Project Project_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Project Project_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizAttempt QuizAttempt_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizAttempt QuizAttempt_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."QuizAttempt"
    ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Quiz Quiz_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Result Result_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Result Result_examId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES public."Exam"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Result Result_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentSubject StudentSubject_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."StudentSubject"
    ADD CONSTRAINT "StudentSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentSubject StudentSubject_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."StudentSubject"
    ADD CONSTRAINT "StudentSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_gradeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES public."Grade"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Parent"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Submission Submission_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Submission Submission_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Teacher Teacher_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Teacher Teacher_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Teacher Teacher_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _ProjectStudents _ProjectStudents_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."_ProjectStudents"
    ADD CONSTRAINT "_ProjectStudents_A_fkey" FOREIGN KEY ("A") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProjectStudents _ProjectStudents_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."_ProjectStudents"
    ADD CONSTRAINT "_ProjectStudents_B_fkey" FOREIGN KEY ("B") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _SubjectToTeacher _SubjectToTeacher_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."_SubjectToTeacher"
    ADD CONSTRAINT "_SubjectToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _SubjectToTeacher _SubjectToTeacher_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lynxlearn_admin
--

ALTER TABLE ONLY public."_SubjectToTeacher"
    ADD CONSTRAINT "_SubjectToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

