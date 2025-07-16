#!/bin/bash

# Teacher Role-Based Access Test Script
# Tests that teacher can only see their assigned students/classes

echo "🧪 Testing Teacher Role-Based Access..."

# Get a sample teacher ID first
TEACHER_ID=$(cd /Users/derahmanyelo/Documents/GitHub/EduLynx && node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const teacher = await prisma.teacher.findFirst();
  console.log(teacher?.id || 'NO_TEACHER');
  await prisma.\$disconnect();
})();
")

if [ "$TEACHER_ID" = "NO_TEACHER" ]; then
  echo "❌ No teacher found in database"
  exit 1
fi

echo "👨‍🏫 Using teacher ID: $TEACHER_ID"

# Test 1: Check students API with teacher role
echo -e "\n1️⃣ Testing Students API with teacher role..."
curl -s "http://localhost:3000/api/students?role=TEACHER&userId=$TEACHER_ID" | jq '.data | length'

# Test 2: Check results API with teacher role
echo -e "\n2️⃣ Testing Results API with teacher role..."
curl -s "http://localhost:3000/api/results?role=TEACHER&userId=$TEACHER_ID" | jq '. | length'

# Test 3: Check assignments API with teacher role
echo -e "\n3️⃣ Testing Assignments API with teacher role..."
curl -s "http://localhost:3000/api/assignments?role=TEACHER&userId=$TEACHER_ID" | jq '. | length'

echo -e "\n✅ Teacher role-based access test completed"
