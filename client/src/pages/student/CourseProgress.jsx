import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useIncompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse] = useCompleteCourseMutation();
  const [incompleteCourse] = useIncompleteCourseMutation();

  // Helper function to check if a lecture is completed
  const isLectureCompleted = (lectureId, progress = []) =>
    progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  // Handle selecting a specific lecture to watch
  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  // Update lecture progress
  const handleLectureProgress = async (lectureId) => {
    try {
      if (!lectureId) return;
      await updateLectureProgress({ courseId, lectureId }).unwrap();
      toast.success("Lecture progress updated!");
      refetch();
    } catch (error) {
      toast.error("Failed to update lecture progress.");
      console.error(error);
    }
  };

  // Mark course as complete
  const handleCompleteCourse = async () => {
    try {
      await completeCourse(courseId).unwrap();
      toast.success("Course marked as complete!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark course as complete.");
      console.error(error);
    }
  };

  // Mark course as incomplete
  const handleIncompleteCourse = async () => {
    try {
      await incompleteCourse(courseId).unwrap();
      toast.success("Course marked as incomplete!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark course as incomplete.");
      console.error(error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data?.data) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, lectures } = courseDetails;
  const initialLecture = currentLecture || (lectures && lectures[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Display course name */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle}</h1>
        <Button
          onClick={completed ? handleIncompleteCourse : handleCompleteCourse}
          variant={completed ? "outline" : "default"}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video section */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={initialLecture?.tutorialUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={() => handleLectureProgress(initialLecture?._id)}
            />
          </div>
          {/* Display current watching lecture title */}
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${lectures.findIndex((lec) => lec._id === initialLecture?._id) + 1} : ${initialLecture?.lectureTitle}`}
            </h3>
          </div>
        </div>

        {/* Lecture Sidebar */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id, progress) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-gray-500 mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id, progress) && (
                    <Badge
                      variant="outline"
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;