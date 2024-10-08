import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/ui/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/ui/preview";
import { File, Loader2, Lock, LockIcon } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";


const ChapterIdPage = async ({
    params
}: {
    params: {courseId: string; chapterId: string;}
}) => {
    const {userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    })

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return ( 
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    label="You already completed this chapter"
                    variant="success"
                />
            )}
            {isLocked && (
                <Banner
                label="You need to purchase this course to watch this chapter"
                variant="warning"
            />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20 ">
                <div className="p-4">
                    { purchase ? <iframe src={chapter.videoUrl!} className="h-full w-full aspect-video">
                    </iframe> : 
                         <div className=" h-full w-full flex items-center justify-center bg-slate-800">
                            <Loader2 className="h-8 w-8 animate-spin text-secondary"/>
                        </div>}
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2" >
                            {chapter.title}
                        </h2>
                        {purchase ? (
                           <div>
                            
                           </div>
                        ): (
                            <CourseEnrollButton
                                courseId = {params.courseId}
                                price = {course.price!}
                            />
                        )}
                    </div>
                    <Separator/>
                    <div>
                        <Preview value={chapter.description!}/>
                    </div>
                    {!!attachments.length && (
                        <>
                            <Separator/>
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                    href = {attachment.url}
                                    target = "_blank"
                                    key = {attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline" >
                                        <File />
                                        <p className="link-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default ChapterIdPage;