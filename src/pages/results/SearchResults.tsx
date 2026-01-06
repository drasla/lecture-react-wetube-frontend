import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { searchVideos, type Video } from "../../api/video.ts";
import { twMerge } from "tailwind-merge";
import {MdSearchOff} from "react-icons/md";
import VideoCard from "../../components/video/VideoCard.tsx";

function SearchResults() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVideos().then(() => {});
    }, [q]);

    const loadVideos = async () => {
        try {
            const result = await searchVideos(q);
            setVideos(result);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    if (!q) return <div className={twMerge(["p-10", "text-center"])}>검색어를 입력해주세요.</div>;
    if (loading) return <div className={twMerge(["p-10", "text-center"])}>로딩중...</div>;

    return (
        <div className={twMerge(["max-w-400", "mx-auto", "p-4", "sm:p-6"])}>
            <h1 className={twMerge(["text-xl", "font-bold", "mb-6"])}>'{q}' 검색 결과</h1>

            {videos.length === 0
                ? (
                    <div className={twMerge(["h-[50dvh]","flex", "flex-col", "justify-center", "items-center"])}>
                        <MdSearchOff className={twMerge(["w-16", "h-16", "opacity-20", "mb-4"])} />
                        <p>검색 결과가 없습니다.</p>
                    </div>
                )
                : (
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
                )
            }
        </div>
    );
}

export default SearchResults;
