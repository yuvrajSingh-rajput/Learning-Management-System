import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { useEditCourseMutation, useGetCourseByIdQuery } from "@/features/api/courseApi";

const CourseTab = () => {
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;
    
    const [input, setInput] = useState({
        courseTitle: '',
        subTitle: '',
        description: '',
        category: '',
        courseLevel: '',
        coursePrice: '',
        courseThumbnail: '',
    });
    const {data: courseByIdData, isLoading: courseByIdIsLoading} = useGetCourseByIdQuery(courseId, {
        refetchOnMountOrArgChange: true,
    });
    
    useEffect(() => {
        if(courseByIdData?.course){
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: '',
            });

        }
    }, [courseByIdData]);

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const [editCourse, {data, isLoading, isError, error, isSuccess}] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if(file){
            setInput({...input, courseThumbnail: file});
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async () => {
        const formdata = new FormData();
        formdata.append("courseTitle", input.courseTitle);
        formdata.append("subTitle", input.subTitle);
        formdata.append("category", input.category);
        formdata.append("description", input.description)
        formdata.append("courseLevel", input.courseLevel);
        formdata.append("courseThumbnail", input.courseThumbnail);
        formdata.append("coursePrice", input.coursePrice);

        await editCourse({formdata, courseId});
    }

    useEffect(() => {
        if(isSuccess){
            toast.success(data.message || "Course edited successfully");
            navigate("/admin/course");
        }
        if(isError){
            toast.error(error.data.message || "Error in editing course");
        }
    }, [isSuccess, isError]);

    if(courseByIdIsLoading) return <h1>Loading ...</h1>
    const isPublished = true;
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button variant="outline">
                        {isPublished ? "Unpublished" : "Publish"}
                    </Button>
                    <Button>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-5">
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Fullstack developer"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory} value={input.category}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel} value={input.courseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                        />
                        {previewThumbnail && (
                            <img
                                src={previewThumbnail}
                                className="e-64 my-2"
                                alt="Course Thumbnail"
                            />
                        )}
                    </div>
                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant="outline">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab;