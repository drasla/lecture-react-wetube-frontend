import { useEffect, useState } from "react";
import { fetchVideos, type Video } from "../api/video.ts";
import { twMerge } from "tailwind-merge";
import VideoCard from "../components/video/VideoCard.tsx";

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const result = await fetchVideos();
                setVideos(result.videos);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        loadVideos().then(() => {});
    }, []);

    if (loading) {
        return (
            <div className={twMerge(["p-8", "text-center", "text-text-disabled"])}>로딩 중...</div>
        );
    }

    if (videos.length === 0) {
        return (
            <div
                className={twMerge(
                    ["flex", "flex-col", "justify-center", "items-center"],
                    ["h-[50dvh]", "text-text-disabled"],
                )}>
                <p className={twMerge(["text-lg"])}>등록된 영상이 없습니다.</p>
                <p className={twMerge(["text-sm"])}>첫 번째 영상을 업로드해보세요!</p>
            </div>
        );
    }

    return (
        <div className={twMerge(["p-4", "sm:p-6"])}>
            <div className={twMerge(["flex", "flex-wrap"])}>
                {videos.map(video => (
                    <div
                        key={video.id}
                        className={twMerge(
                            ["w-full", "sm:w-1/2", "md:w-1/3", "lg:w-1/4"],
                            ["px-2", "mb-8"],
                        )}>
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
