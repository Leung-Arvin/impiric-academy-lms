import { db } from "@/lib/db";
import {Mux} from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const Video = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret:process.env.MUX_TOKEN_SECRET!,
});


export async function DELETE(
    res: Request,
    {params} : {params: {courseId: string; chapterId:string}}
) {
    try {
        const {userId} = auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", {status: 404});
        }

        if (chapter.videoUrl) {
            const existingMuxData = await db.video.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if (existingMuxData) {
                
                await db.video.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                }, 
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH(
    req:Request,
    {params} : {params: {courseId: string; chapterId:string; videoUrl: string;}}
) {
    try {
        const {userId} = auth();
        const {isPublished, ...values} = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
                videoUrl: params.videoUrl,
            },
            data: {
                ...values,
            }
        });


        return NextResponse.json(chapter);
        
    } catch (error) {
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}