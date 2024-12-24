import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi';
import { Edit } from 'lucide-react';

const CourseTable = () => {
    const navigate = useNavigate();
    const {data, isLoading} = useGetCreatorCourseQuery();

    if(isLoading) return <h1>Loading ...</h1>
    console.log("data", data);
    
    return (
        <div>
            <Button onClick={() => navigate(`create`)}>Create a new course</Button>
            <Table>
                <TableCaption>A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[100px]">Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.courses.map((course) => (
                        <TableRow key={course._id}>
                            <TableCell>{course.courseTitle}</TableCell>
                            <TableCell className="font-medium">{course?.coursePrice ? course.coursePrice + '₹' : "NA"}</TableCell>
                            <TableCell><Badge>{course.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                            <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => navigate(`/admin/course/${course._id}`)}><Edit/></Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default CourseTable;