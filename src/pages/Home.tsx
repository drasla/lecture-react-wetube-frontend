import { useCallback, useEffect, useRef, useState } from "react";
import { fetchVideos, type Video } from "../api/video.ts";
import { twMerge } from "tailwind-merge";
import VideoCard from "../components/video/VideoCard.tsx";
import Spinner from "../components/ui/Spinner.tsx";

function Home() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    const [fetching, setFetching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const LIMIT = 12;

    const loadVideos = useCallback(async (pageNum: number) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setFetching(true);

            const result = await fetchVideos(pageNum, LIMIT);

            // state의 set함수의 매개변수에는 함수가 들어갈 수 있음
            // 함수를 사용하면, 매개변수 자리엔 원래 있던 값이 들어감
            setVideos(prev => {
                if (pageNum === 1) return result.videos;

                // 그냥 이대로 덧붙여주기만 하면 시간차가 존재하기 때문에 중복이 될 수 있음
                // 새로 도착한 result.videos에 filter로 걸러내기를 할건데
                // 그 새로운 요소(newV)를 순회하며 판단을 함
                // 기존 데이터(prev)에 조건 (prevV의 id와 newV의 id가 같으면) 탈락되도록
                const newVideos = result.videos.filter(
                    newV => !prev.some(prevV => prevV.id === newV.id),
                );
                return [...prev, ...newVideos];
            });
            setHasNextPage(result.hasNextPage);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setFetching(false);
        }
    }, []);

    // 초기 로딩에 대해서만 관여함
    // 왜냐하면, loadVideos는 useCallback으로 감싸줬기 때문에 변하지 않을 것임
    useEffect(() => {
        loadVideos(1).then(() => {});
    }, [loadVideos]);

    // useRef : 해당 HTML 컴포넌트를 대상으로 선택하는 훅
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 타겟에 대한 감지 기능을 먼저 작성
        // IntersectionObserver(동작함수, 옵션)
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !loading && !fetching) {
                    setPage(prev => prev + 1);
                }
            },
            {
                // 감지 기준을 0 ~ 1
                // 감지 기준을 50%로 설정
                threshold: 0.5,
            },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        // 해당 컴포넌트를 사용자가 벗어나게 되면 실행됨. 메모리 누수 방지
        return () => observer.disconnect();
    }, [hasNextPage, loading, fetching]);

    // 페이지 번호가 바뀔 때 동작하는 useEffect
    useEffect(() => {
        if (page > 1) {
            loadVideos(page).then(() => {});
        }
    }, [page, loadVideos]);

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

            <div
                ref={observerTarget}
                className={twMerge([
                    "h-10",
                    "flex",
                    "justify-center",
                    "items-center",
                    "w-full",
                    "mt-8",
                ])}>
                {fetching && <Spinner color={"primary"} />}
            </div>

            {!hasNextPage && videos.length > 0 && (
                <div className={twMerge(["text-center", "text-sm", "py-10"])}>
                    모든 동영상을 불러왔습니다.
                </div>
            )}
        </div>
    );
}

export default Home;
