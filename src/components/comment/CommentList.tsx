import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { type FormEvent, useEffect, useState } from "react";
import { type Comment, createComment, deleteComment, fetchComments } from "../../api/comment.ts";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "../../store/useAuthStore.ts";
import Avatar from "../ui/Avatar.tsx";
import Button from "../ui/Button.tsx";

dayjs.extend(relativeTime);
dayjs.locale("ko");

type CommentListProps = {
    videoId: number;
};

function CommentList({ videoId }: CommentListProps) {
    const { user, isLoggedIn } = useAuthStore();

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");

    useEffect(() => {
        loadComments().then(() => {});
    }, []);

    const loadComments = async () => {
        try {
            const data = await fetchComments(videoId);
            setComments(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // 댓글 등록
    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const newComment = await createComment(videoId, content);
            // 등록이 끝났으니까 그 목록을 다시 로딩해서 화면에 출력해주는 것이 아니라
            // 우리가 갖고있는 목록에다가만 추가해주면 될 것임
            setComments([newComment, ...comments]);
            setContent("");
        } catch (e) {
            console.log(e);
            alert("댓글 등록에 실패했습니다.")
        }
    };

    // 댓글 삭제
    const handleDelete = async (commentId: number) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (e) {
            console.log(e);
            alert("댓글 삭제가 실패되었습니다.")
        }
    };

    return (
        <div className={"mt-6"}>
            <h3 className={twMerge(["text-lg", "font-bold", "mb-4"])}>댓글 {comments.length}개</h3>

            {/* 댓글 입력 폼 */}
            {user && (
                <form
                    onSubmit={onSubmit}
                    className={twMerge(["flex", "flex-col", "gap-2", "mb-8"])}>
                    <div className={twMerge(["flex", "gap-4"])}>
                        <Avatar nickname={user.nickname} src={user.profileImage} size={"md"} />
                        <div className={"flex-1"}>
                            <input
                                placeholder={"댓글 추가..."}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className={twMerge(
                                    ["w-full", "border-b", "border-divider", "py-2"],
                                    ["focus:outline-none", "focus:border-text-default"],
                                )}
                            />
                        </div>
                    </div>
                    <div className={twMerge(["flex", "justify-end"])}>
                        <button type={"submit"} disabled={!content.trim()} className={twMerge(
                            ["px-4", "py-2", "rounded-full"],
                            ["text-background-default", "bg-text-default", "text-sm"],
                            ["disabled:opacity-50", "disabled:cursor-not-allowed"],
                        )}>
                            등록
                        </button>
                    </div>
                </form>
            )}

            {/* 댓글 목록 */}
            <div className={twMerge(["space-y-6"])}>
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        className={twMerge(["flex", "justify-between", "gap-4", "group"])}>
                        <Avatar
                            nickname={comment.author.nickname}
                            src={comment.author.profileImage}
                            size={"md"}
                        />
                        <div className={"flex-1"}>
                            <div className={twMerge(["flex", "items-center", "gap-2", "mb-1"])}>
                                <span className={twMerge(["text-xs", "font-bold"])}>
                                    {comment.author.nickname}
                                </span>
                                <span className={twMerge(["text-xs", "text-text-disabled"])}>
                                    {dayjs(comment.createdAt).fromNow()}
                                </span>
                            </div>
                            <p className={twMerge(["text-sm"])}>{comment.content}</p>
                        </div>
                        {user?.id === comment.author.id && (
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={() => handleDelete(comment.id)}>
                                삭제
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentList;
