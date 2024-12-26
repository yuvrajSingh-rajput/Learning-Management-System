import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLecutureMutation, useGetCourseLecturesQuery } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
    const params = useParams();
    const navigate = useNavigate();
    const courseId = params.courseId;
    const [lectureTitle, setLectureTitle] = useState("");

    const [createLecture, { 
        isLoading, 
        data, 
        isSuccess, 
        error, 
        isError 
    }] = useCreateLecutureMutation();

    const createLectureHandler = async () => {
        await createLecture({ courseId, lectureTitle });
    }
    const {
        data: lectureData, 
        isLoading: lectureIsLoading,
        error: lectureError,
        refetch
    } = useGetCourseLecturesQuery(courseId);

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.error(data.message || "lecture successfully created");
        }
        if (isError) {
            toast.error(error.data.message || "error in creating lecture");
        }
    }, [isSuccess, isError, error, data])

    return (
        <div className="flex-1 mx-10">
            <div className="mb-4">
                <h1 className="font-bold text-xl">
                    Let's add lectures, add some basic details for your new lecture
                </h1>
                <p className="text-sm">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
                    laborum!
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        onChange={(e) => setLectureTitle(e.target.value)}
                        value={lectureTitle}
                        placeholder="Your Title Name"
                    />

                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/admin/course/${courseId}`)}
                    >
                        Back to course
                    </Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Create lecture"
                        )}
                    </Button>
                </div>
                <div className="mt-10">
                    {lectureIsLoading ? (
                        <p>Loading lectures...</p>
                    ) : lectureError ? (
                        <p>Failed to load lectures.</p>
                    ) : lectureData.lectures.length === 0 ? (
                        <p>No lectures availabe</p>
                    ) : (
                        lectureData.lectures.map((lecture, index) => (
                            <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateLecture;