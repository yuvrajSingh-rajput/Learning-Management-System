import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";

const BuyCourseButton = ({courseId}) => {
    const [createCheckoutSession, {
            data, 
            isLoading, 
            isSuccess, 
            error,
            isError
        }] = useCreateCheckoutSessionMutation();

    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId);
    }

    useEffect(() => {
        if(isSuccess){
            if(data?.url){
                window.location.href = data.url;    // Redirect to stripe checkout url;
            }else{
                toast.error("invalid response from server");
            }
        }
        if(isError){
            toast.error(error.data.error || "failed to create checkout");
        }
    }, [isSuccess, isError, data, error]);
    
    return (
        <Button
            onClick={purchaseCourseHandler}
            disabled={isLoading}
            className="w-full"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                </>
            ) : (
                "Purchase Course"
            )}
        </Button>
    )
}

export default BuyCourseButton;