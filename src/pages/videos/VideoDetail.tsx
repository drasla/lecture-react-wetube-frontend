import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchVideo, toggleVideoLike, type Video } from "../../api/video.ts";
import { twMerge } from "tailwind-merge";
import Avatar from "../../components/ui/Avatar.tsx";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { MdThumbUp, MdThumbUpOffAlt } from "react-icons/md";
import { useModalStore } from "../../store/useModalStore.ts";
import { toggleSubscription } from "../../api/subscription.ts";

function VideoDetail() {
    const { id } = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);

    const { user, isLoggedIn } = useAuthStore();
    const { openModal } = useModalStore();

    const loadData = async (videoId: number) => {
        try {
            const data = await fetchVideo(videoId);
            setVideo(data);
            setIsLiked(data.isLiked || false);
            setLikeCount(data.likeCount);
            setIsSubscribed(data.isSubscribed || false);
            setSubscriberCount(data.subscriberCount || 0);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadData(Number(id)).then(() => {});
        }
    }, [id]);

    // 좋아요 버튼 클릭 함수 작성
    const handleLikeClick = async () => {
        if (!video) {
            return;
        }

        if (!isLoggedIn) {
            openModal("LOGIN_REQUIRED");
            return;
        }

        // API 요청을 통해서 좋아요 상태를 변경하기 이전에 미리 UI를 변경하여 즉시 반영되도록 사용자에게 눈속임
        const prevIsLiked = isLiked;      // 요청하기 이전 상태를 기억
        const prevCount = likeCount;

        // 이미 좋아요를 했을 때와, 좋아요가 안 되어 있을 때를 모두 생각
        setIsLiked(!prevIsLiked);
        setLikeCount(prevIsLiked ? prevCount - 1 : prevCount + 1);

        try {
            await toggleVideoLike(video.id);
        } catch (e) {
            console.log(e);
            setIsLiked(prevIsLiked);
            setLikeCount(prevCount);
        }
    }

    // 구독 버튼 클릭 함수
    const handleSubscribeClick = async () => {
        if (!video) return;
        if (!isLoggedIn) {
            openModal("LOGIN_REQUIRED");
            return;
        }

        const prevIsSubscribed = isSubscribed;      // 요청하기 이전 상태를 기억
        const prevSubscriberCount = subscriberCount;

        setIsSubscribed(!prevIsSubscribed);
        setSubscriberCount(prevIsSubscribed ? prevSubscriberCount - 1 : prevSubscriberCount + 1);

        try {
            await toggleSubscription(video.author.id);
        } catch (e) {
            console.log(e);
            setIsSubscribed(prevIsSubscribed);
            setSubscriberCount(prevSubscriberCount);
        }
    }



    if (loading) {
        return <div className={twMerge(["pt-20", "text-center"])}>로딩 중...</div>;
    }

    if (!video) {
        return <div className={twMerge(["pt-20", "text-center"])}>비디오를 찾을 수 없습니다.</div>;
    }

    return (
        <div
            className={twMerge(
                ["w-full", "max-w-400", "mx-auto", "p-4"],
                ["flex", "flex-col", "lg:flex-row", "gap-6"],
            )}>
            {/* 왼쪽 영역 */}
            <div className={twMerge(["flex-1"])}>
                {/* 비디오 플레이어 */}
                <div
                    className={twMerge([
                        "w-full",
                        "aspect-video",
                        "rounded-xl",
                        "overflow-hidden",
                    ])}>
                    {/*
                        video tag
                        controls : 비디오 컨트롤 기능 활성화
                        autoPlay : 자동 재생
                        loop : 반복 재생
                    */}
                    <video
                        src={video.videoPath}
                        controls
                        autoPlay
                        className={twMerge(["w-full", "h-full"])}
                    />
                </div>

                <div className={twMerge(["mt-4", "pb-4", "border-b", "border-divider"])}>
                    <h1 className={twMerge(["text-xl", "font-bold", "mb-2"])}>{video.title}</h1>
                    <div className={twMerge(["flex", "items-center", "justify-between"])}>
                        <div className={twMerge(["flex", "items-center", "gap-3"])}>
                            <Avatar
                                nickname={video.author.nickname}
                                src={video.author.profileImage}
                            />
                            <div>
                                <p className={twMerge(["font-semibold", "text-sm"])}>
                                    {video.author.nickname}
                                </p>
                                <p className={twMerge(["text-xs", "text-text-disabled"])}>
                                    구독자 {subscriberCount.toLocaleString()}명
                                </p>
                            </div>
                            {/* 구독 버튼 : 본인일 때에는 나오지 말아야 함 */}
                            {user?.id !== video.author.id && (
                                <button
                                    className={twMerge(
                                        ["ml-4", "px-4", "py-2", "rounded-full"],
                                        ["text-sm", "font-medium", "hover:opacity-90"],
                                        isSubscribed
                                            ? ["bg-success-main", "text-success-contrastText"]
                                            : ["bg-text-default", "text-background-default"],
                                    )}
                                    onClick={handleSubscribeClick}
                                >
                                    {isSubscribed ? "구독중" : "구독"}
                                </button>
                            )}
                        </div>

                        <div className={twMerge(["flex", "gap-2"])}>
                            <button
                                className={twMerge(
                                    ["flex", "items-center", "gap-2"],
                                    ["ml-4", "px-4", "py-2", "rounded-full"],
                                    ["text-sm", "font-medium", "hover:opacity-90"],
                                    isLiked
                                        ? ["bg-success-main", "text-success-contrastText"]
                                        : ["bg-text-default", "text-background-default"],
                                )}
                                onClick={handleLikeClick}
                            >
                                {isLiked ? (
                                    <MdThumbUp className={twMerge(["w-5", "h-5"])} />
                                ) : (
                                    <MdThumbUpOffAlt className={twMerge(["w-5", "h-5"])} />
                                )}
                                <span className={twMerge(["text-sm", "font-medium"])}>
                                    {likeCount}
                                </span>
                            </button>
                            <button
                                className={twMerge(
                                    ["flex", "items-center", "gap-2"],
                                    ["px-4", "py-2", "rounded-full"],
                                    ["text-sm", "font-medium", "hover:opacity-90"],
                                    ["bg-text-default", "text-background-default"],
                                )}>
                                공유
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽 영역 */}
            <div className={twMerge(["hidden", "lg:block", "lg:w-87.5"])}>
                <p className={twMerge(["font-bold", "mb-4"])}>다음 동영상</p>
                <div className={twMerge(["space-y-3"])}>
                    <div
                        className={twMerge(
                            ["h-24", "rounded-lg", "border", "border-divider"],
                            ["flex", "justify-center", "items-center"],
                        )}>
                        추천 영상 영역
                    </div>
                    <div
                        className={twMerge(
                            ["h-24", "rounded-lg", "border", "border-divider"],
                            ["flex", "justify-center", "items-center"],
                        )}>
                        추천 영상 영역
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoDetail;
