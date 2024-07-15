"use client";

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, PlusCircleIcon, Video } from "lucide-react";
import { useState } from "react";
import { Chapter } from "@prisma/client";


interface ChapterVideoProps {
    initialData: Chapter;
    chapterId: string;
    courseId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1 , {
        message: "Video Url is required",
    }),
});

export const ChapterVideo = ({
    initialData, 
    courseId,
    chapterId,
}: ChapterVideoProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { videoUrl: initialData?.videoUrl || undefined }
    });

    const { isSubmitting,isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Course Title Updated")
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return ( <div className="mt-6 border bg-slate-100 rounded-md p-4"> 
        <div className="font-medium flex items-center justify-between">
            Video Embed
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && !initialData.videoUrl && (
                    <>
                        <PlusCircleIcon className ="h-4 w-4 mr-2"/>
                        Add an video
                    </>
                )}
                {!isEditing && initialData.videoUrl && (
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit video
                    </>
                )}
                
            </Button>
        </div>
        {!isEditing && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className="h-10 w-10 text-slate-500"/>

                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                    <iframe className="w-full h-full" src={initialData.videoUrl}  allowFullScreen></iframe>
                </div>
            )
        )}
        {isEditing && (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <FormField control={form.control}
                        name="videoUrl"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting} 
                                    placeholder="e.g. 'Advanced web development"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button
                            disabled= {!isValid || isSubmitting}
                            type = "submit"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        )}
        </div>  );
}
 
