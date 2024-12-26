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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
    useEditLectureMutation, 
    useGetLectureByIdQuery, 
    useRemoveLectureMutation 
} from "@/features/api/courseApi";

const MEDIA_API = "http://localhost:3000/api/v1/media";

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const [videoInfo, setVideoInfo] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const {courseId, lectureId} = params;

    const {data: getLectureByIdData} = useGetLectureByIdQuery({courseId, lectureId});
    const lecture = getLectureByIdData?.lecture;
    console.log(lecture);
    useEffect(() => {
        setLectureTitle(lecture?.lectureTitle);
        setIsPreviewFree(lecture?.isPreviewFree);
        setVideoInfo(lecture?.videoInfo);
    }, [lecture])

    const [editLecure, {data, isLoading, isError, error, isSuccess}] = useEditLectureMutation();

    const updateLectureHandler = async () => {
        await editLecure({
            lectureTitle,
            videoInfo,
            isPreviewFree,
            courseId,
            lectureId,
        });
    };

    useEffect(() => {
        if(isSuccess){
            toast.success(data.message);
        }
        if(isError){
            toast.error(error.data.message);
        }
    }, [isLoading, isError]);

    const [removeLecture, {
        data: removeLectureData,
        isLoading: removeLectureIsLoading, 
        isSuccess: removeLectureIsSuccess,
        isError: removeLectureIsError,
        error: removeLectureError,
    }] = useRemoveLectureMutation();

    const removeLectureHandler = async () => {
        await removeLecture({courseId, lectureId});
    }

    useEffect(() => {
        if(removeLectureIsSuccess){
            toast.success(removeLectureData.message);
            navigate(`/admin/course/${courseId}/lecture`);
        }
        if(removeLectureIsError){
            toast.error(removeLectureError.data.message);
        }
    }, [removeLectureIsSuccess, removeLectureIsError]);

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const response = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    },
                });
                if (response.data.success) {
                    setVideoInfo({ 
                        tutorialUrl: response.data.data.url, 
                        publicId: response.data.data.public_id, 
                    });
                    console.log(videoInfo);
                    setBtnDisable(false);
                    toast.success(response.data.message);
                }
            } catch (error) {
                console.error(error);
                toast.error("Error in uploading video");
            } finally {
                setMediaProgress(false);
            }
        }
    };

    return (
        <Card>
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>
                        Make changes and click save when done.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button disbaled={removeLectureIsLoading} variant="destructive" onClick={removeLectureHandler}>
                        {
                            removeLectureIsLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        onChange={(e) => setLectureTitle(e.target.value)}
                        value={lectureTitle}
                        placeholder="Ex. Introduction to Javascript"
                    />
                </div>
                <div className="my-5">
                    <Label>
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to Javascript"
                        className="w-fit"
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch id="airplane-mode" checked={isPreviewFree} onCheckedChange={setIsPreviewFree} />
                    <Label htmlFor="airplane-mode">Is this video FREE</Label>
                </div>

                {mediaProgress && (
                    <div className="my-4">
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}

                <div className="mt-4">
                    <Button disabled={isLoading} onClick={updateLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Update Lecture"
                        }

                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default LectureTab;