import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

const ChapterIdPage = async ({
    params
}: {
    params: {courseId: string; chapterId: string}
}) => {

    const {userId} = auth();

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        },
    });

    return ( 
        <div>
            Chapter Id
        </div>
     );
}
 
export default ChapterIdPage;