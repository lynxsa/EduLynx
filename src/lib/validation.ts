export interface ValidationRule {
  field: string;
  value: unknown;
  rules: string[];
  customMessage?: string;
}

export interface ValidationResult<T = Record<string, unknown>> {
  isValid: boolean;
  errors: string[];
  data?: T;
}

export class Validator {
  private errors: string[] = [];

  required(value: unknown, fieldName: string): this {
    if (value === null || value === undefined || value === '') {
      this.errors.push(`${fieldName} is required`);
    }
    return this;
  }

  email(value: string, fieldName: string): this {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.errors.push(`${fieldName} must be a valid email address`);
    }
    return this;
  }

  minLength(value: string, min: number, fieldName: string): this {
    if (value && value.length < min) {
      this.errors.push(`${fieldName} must be at least ${min} characters long`);
    }
    return this;
  }

  maxLength(value: string, max: number, fieldName: string): this {
    if (value && value.length > max) {
      this.errors.push(`${fieldName} must not exceed ${max} characters`);
    }
    return this;
  }

  numeric(value: unknown, fieldName: string): this {
    if (value && (isNaN(Number(value)) || !isFinite(Number(value)))) {
      this.errors.push(`${fieldName} must be a valid number`);
    }
    return this;
  }

  integer(value: unknown, fieldName: string): this {
    if (value && !Number.isInteger(Number(value))) {
      this.errors.push(`${fieldName} must be an integer`);
    }
    return this;
  }

  positive(value: number, fieldName: string): this {
    if (value && value <= 0) {
      this.errors.push(`${fieldName} must be a positive number`);
    }
    return this;
  }

  min(value: number, min: number, fieldName: string): this {
    if (value && value < min) {
      this.errors.push(`${fieldName} must be at least ${min}`);
    }
    return this;
  }

  max(value: number, max: number, fieldName: string): this {
    if (value && value > max) {
      this.errors.push(`${fieldName} must not exceed ${max}`);
    }
    return this;
  }

  oneOf(value: unknown, allowedValues: unknown[], fieldName: string): this {
    if (value && !allowedValues.includes(value)) {
      this.errors.push(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
    return this;
  }

  date(value: unknown, fieldName: string): this {
    if (value && isNaN(Date.parse(String(value)))) {
      this.errors.push(`${fieldName} must be a valid date`);
    }
    return this;
  }

  pastDate(value: any, fieldName: string): this {
    if (value) {
      const date = new Date(value);
      if (date >= new Date()) {
        this.errors.push(`${fieldName} must be in the past`);
      }
    }
    return this;
  }

  futureDate(value: any, fieldName: string): this {
    if (value) {
      const date = new Date(value);
      if (date <= new Date()) {
        this.errors.push(`${fieldName} must be in the future`);
      }
    }
    return this;
  }

  phone(value: string, fieldName: string): this {
    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
      this.errors.push(`${fieldName} must be a valid phone number`);
    }
    return this;
  }

  custom(value: any, validator: (val: any) => boolean, message: string): this {
    if (!validator(value)) {
      this.errors.push(message);
    }
    return this;
  }

  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
    };
  }

  reset(): this {
    this.errors = [];
    return this;
  }
}

// Predefined validators for common entities
export function validateUser(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.email, 'Email')
    .email(data.email, 'Email')
    .required(data.firstName, 'First name')
    .minLength(data.firstName, 2, 'First name')
    .maxLength(data.firstName, 50, 'First name')
    .required(data.lastName, 'Last name')
    .minLength(data.lastName, 2, 'Last name')
    .maxLength(data.lastName, 50, 'Last name')
    .required(data.role, 'Role')
    .oneOf(data.role, ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'], 'Role');

  if (data.password) {
    validator.minLength(data.password, 8, 'Password');
  }

  if (data.phone) {
    validator.phone(data.phone, 'Phone number');
  }

  if (data.dateOfBirth) {
    validator.date(data.dateOfBirth, 'Date of birth').pastDate(data.dateOfBirth, 'Date of birth');
  }

  return validator.getResult();
}

export function validateStudent(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.username, 'Username')
    .minLength(data.username, 3, 'Username')
    .maxLength(data.username, 30, 'Username')
    .required(data.name, 'Name')
    .minLength(data.name, 2, 'Name')
    .required(data.surname, 'Surname')
    .minLength(data.surname, 2, 'Surname')
    .required(data.email, 'Email')
    .email(data.email, 'Email')
    .required(data.phone, 'Phone')
    .phone(data.phone, 'Phone')
    .required(data.address, 'Address')
    .required(data.bloodType, 'Blood type')
    .required(data.sex, 'Sex')
    .oneOf(data.sex, ['MALE', 'FEMALE'], 'Sex')
    .required(data.birthday, 'Birthday')
    .date(data.birthday, 'Birthday')
    .pastDate(data.birthday, 'Birthday');

  return validator.getResult();
}

export function validateTeacher(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.username, 'Username')
    .minLength(data.username, 3, 'Username')
    .maxLength(data.username, 30, 'Username')
    .required(data.name, 'Name')
    .minLength(data.name, 2, 'Name')
    .required(data.surname, 'Surname')
    .minLength(data.surname, 2, 'Surname')
    .required(data.email, 'Email')
    .email(data.email, 'Email')
    .required(data.phone, 'Phone')
    .phone(data.phone, 'Phone')
    .required(data.address, 'Address')
    .required(data.bloodType, 'Blood type')
    .required(data.sex, 'Sex')
    .oneOf(data.sex, ['MALE', 'FEMALE'], 'Sex')
    .required(data.birthday, 'Birthday')
    .date(data.birthday, 'Birthday')
    .pastDate(data.birthday, 'Birthday');

  if (data.yearsExperience !== undefined) {
    validator
      .integer(data.yearsExperience, 'Years of experience')
      .min(data.yearsExperience, 0, 'Years of experience');
  }

  return validator.getResult();
}

export function validateClass(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.name, 'Class name')
    .minLength(data.name, 2, 'Class name')
    .maxLength(data.name, 50, 'Class name')
    .required(data.capacity, 'Capacity')
    .integer(data.capacity, 'Capacity')
    .positive(data.capacity, 'Capacity');

  return validator.getResult();
}

export function validateLesson(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.name, 'Lesson name')
    .minLength(data.name, 2, 'Lesson name')
    .required(data.day, 'Day')
    .oneOf(data.day, ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], 'Day')
    .required(data.startTime, 'Start time')
    .date(data.startTime, 'Start time')
    .required(data.endTime, 'End time')
    .date(data.endTime, 'End time')
    .required(data.subjectId, 'Subject')
    .integer(data.subjectId, 'Subject')
    .required(data.classId, 'Class')
    .integer(data.classId, 'Class')
    .required(data.teacherId, 'Teacher');

  // Validate that end time is after start time
  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    if (endTime <= startTime) {
      validator.custom(false, () => true, 'End time must be after start time');
    }
  }

  return validator.getResult();
}

export function validateAssignment(data: any): ValidationResult {
  const validator = new Validator();

  validator
    .required(data.title, 'Title')
    .minLength(data.title, 3, 'Title')
    .maxLength(data.title, 200, 'Title')
    .required(data.startDate, 'Start date')
    .date(data.startDate, 'Start date')
    .required(data.dueDate, 'Due date')
    .date(data.dueDate, 'Due date')
    .futureDate(data.dueDate, 'Due date')
    .required(data.lessonId, 'Lesson')
    .integer(data.lessonId, 'Lesson');

  // Validate that due date is after start date
  if (data.startDate && data.dueDate) {
    const startDate = new Date(data.startDate);
    const dueDate = new Date(data.dueDate);
    if (dueDate <= startDate) {
      validator.custom(false, () => true, 'Due date must be after start date');
    }
  }

  return validator.getResult();
}
