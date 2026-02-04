

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
  const uniqueStudents = new Set();
  let totalProfit = 0;
  let studentList = [];

  listOfCourses.forEach((course) => {
    course.students.forEach((student) => {
      // ✅ unique student
      uniqueStudents.add(student.studentEmail); // or student.studentId

      // revenue (course wise is fine)
      totalProfit += course.pricing;

      studentList.push({
        courseTitle: course.title,
        studentName: student.studentName,
        studentEmail: student.studentEmail,
      });
    });
  });

  return {
    totalStudents: uniqueStudents.size, // ⭐ UNIQUE COUNT
    totalProfit,
    studentList,
  };
}

  

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: calculateTotalStudentsAndProfit().totalProfit,
    },
  ];

  return (
    <div>
      <h2 className="md:text-[22px] font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculateTotalStudentsAndProfit().studentList.map(
                  (studentItem, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell>{studentItem.studentName}</TableCell>
                      <TableCell>{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;