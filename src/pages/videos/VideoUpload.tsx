import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { useEffect, useState, type KeyboardEvent } from "react";
import { MdCloudUpload, MdImage } from "react-icons/md";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { useNavigate } from "react-router";
import { api } from "../../api/axios.ts";
import type { AxiosError } from "axios";

interface UploadFormData {
    title: string;
    description: string;
    video: FileList;
    thumbnail: FileList;
}

function VideoUpload() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch, // 비슷한 역할을 하는 건 getValues
        // watch : 실시간으로 감시해서 값이 변경되면 그 변경된 값으로 가져옴
        formState: { errors, isSubmitting },
    } = useForm<UploadFormData>();

    // 비디오 파일 선택 시 미리보기 생성 코드 작성
    const videoFile = watch("video");

    // 사용자의 컴퓨터에 있는 파일 경로를 임시로 인터넷 URL처럼 작성한 걸 video 파일에 src에 넣을 state
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (videoFile && videoFile.length > 0) {
            const file = videoFile[0];
            // URL.createObjectURL : 임시 URL 발급
            const url = URL.createObjectURL(file);
            setVideoPreview(url);

            // URL.createObjectURL로 발급받았던 URL은 사용 후 반드시 해제해야 함
            // 해제하지 않으면 프로그램이 끝날 때 까지 계속 메모리에 상주하기 때문
            return () => URL.revokeObjectURL(url);
        }
    }, [videoFile]);

    // 썸네일 파일 선택 시 미리보기 생성 코드 작성
    const thumbnailFile = watch("thumbnail");
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    useEffect(() => {
        if (thumbnailFile && thumbnailFile.length > 0) {
            const file = thumbnailFile[0];
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [thumbnailFile]);

    // 해시태그 관리용 코드
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    // KeyboardEvent는 Javascript 타입과 React 타입이 있어서 에러
    // import { type KeyboardEvent } from "react"; 를 명시적으로 기재
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        // 엔터나 콤마를 사용자가 입력했을 때
        if (event.key === "Enter" || event.key === ",") {
            // submit의 기본 기능을 동작되지 않도록 함
            event.preventDefault();
            // trim() : string의 양 끝단에 존재하는 공백 제거
            // replace(정규표현식, 대체문자열) : 정규표현식에 해당하는 문자열을 대체문자열로 변경
            const newTag = tagInput.trim().replace(/^#/, "");
            // includes() : 배열에 특정 요소가 존재하는지 확인
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                setTagInput("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        // 외부에서 주입받은 tagToRemove에 해당하는 string과
        // 내부 요소가 다른 것들만 필터링해서 출력한 뒤, tags state에 저장
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const onSubmit = async (data: UploadFormData) => {
        try {
            // onSubmit을 할 때 전달받은 정보는 UploadFormData 뿐임
            // 그런데 그 내용에는 해시태그에 대한 내용이 없음

            const formData = new FormData();    // 전달을 하려고 하는 FormData 형식을 새로 만들어줌
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("video", data.video[0]);
            formData.append("thumbnail", data.thumbnail[0]);
            formData.append("hashtags", JSON.stringify(tags));

            // 서버 전송
            await api.post("/videos", formData, {
                headers: {
                    // 파일이 포함된 전송을 할 때에는 꼭. 필수로.
                    // Content-Type을 multipart/form-data 로 해줘야 함.
                    "Content-Type": "multipart/form-data",
                }
            });

            alert("업로드가 완료 되었습니다!");
            navigate("/");
        } catch (e) {
            console.log(e);
            const axiosError = e as AxiosError<{ message: string }>;
            const msg = axiosError.response?.data.message || "업로드 실패";
            alert(msg);
        }
    }

    return (
        <div
            className={twMerge(
                ["min-h-[calc(100dvh-56px)]", "px-4", "py-10"],
                ["flex", "justify-center", "items-center"],
            )}>
            <div className={twMerge(["w-full", "max-w-200", "space-y-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>동영상 업로드</h1>

                <form className={"space-y-8"} onSubmit={handleSubmit(onSubmit)}>
                    {/* 동영상 업로드 */}
                    <div className={"space-y-2"}>
                        <label className={twMerge(["block", "text-sm", "font-medium"])}>
                            동영상 파일
                        </label>
                        <div
                            className={twMerge(
                                ["relative", "flex", "flex-col", "justify-center", "items-center"],
                                [
                                    "w-full",
                                    "h-64",
                                    "border-2",
                                    "border-divider",
                                    "rounded-lg",
                                    "border-dashed",
                                ],
                                ["bg-background-paper", "overflow-hidden", "cursor-pointer"],
                            )}>
                            {videoPreview ? (
                                <video
                                    src={videoPreview}
                                    className={twMerge([
                                        "w-full",
                                        "h-full",
                                        "object-contain",
                                        "bg-black",
                                    ])}
                                />
                            ) : (
                                <div
                                    className={twMerge([
                                        "flex",
                                        "flex-col",
                                        "items-center",
                                        "justify-center",
                                    ])}>
                                    <MdCloudUpload className={twMerge(["w-10", "h-10", "mb-3"])} />
                                    <p className={twMerge(["text-sm", "font-semibold"])}>
                                        클릭하여 업로드 또는 드래그
                                    </p>
                                </div>
                            )}

                            {/* label 태그는 htmlFor 속성을 통해서 label 클릭 시 input이 동작되게 했었음
                                하지만 지금은 영역이 div이기 때문에 그러한 방법이 사용 불가
                                그래서 부모 영역 전체에 해당하도록 absolute, inset-0, w-full, h-full 을 주고
                                opacity-0를 통해 사용자에게는 보여지지 않게끔 함
                            */}
                            <input
                                type={"file"}
                                accept={"video/*"}
                                className={twMerge([
                                    "absolute",
                                    "inset-0",
                                    "w-full",
                                    "h-full",
                                    "opacity-0",
                                ])}
                                {...register("video", { required: "비디오 파일을 선택해주세요." })}
                            />
                        </div>
                        {errors.video && (
                            <p className={twMerge(["text-error-main", "text-xs"])}>
                                {errors.video.message}
                            </p>
                        )}
                    </div>

                    {/* 정보 입력 */}
                    <div className={twMerge(["flex", "gap-6", "flex-col", "md:flex-row"])}>
                        <div className={twMerge(["w-full", "md:w-2/3", "space-y-4"])}>
                            <Input
                                label={"제목"}
                                placeholder={"동영상 제목을 입력하세요"}
                                error={errors.title?.message}
                                registration={register("title", { required: "제목은 필수입니다." })}
                            />
                            <div className={twMerge(["flex", "flex-col", "gap-1"])}>
                                <label className={twMerge(["text-sm", "font-medium"])}>설명</label>
                                <textarea
                                    className="w-full h-32 rounded-md border border-divider bg-background-default px-3 py-2 text-sm text-text-default placeholder:text-text-disabled focus:outline-none focus:border-secondary-main resize-none"
                                    placeholder="동영상에 대한 설명을 입력하세요"
                                    {...register("description", {
                                        required: "설명은 필수입니다.",
                                    })}></textarea>
                                {errors.description && (
                                    <span className="text-xs text-error-main">
                                        {errors.description.message}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={twMerge(["w-full", "md:w-1/3"])}>
                            <label className="block text-sm font-medium text-text-default">
                                썸네일
                            </label>
                            <div className="relative w-full aspect-video border border-divider rounded-md bg-background-paper overflow-hidden flex items-center justify-center group">
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-text-disabled flex flex-col items-center">
                                        <MdImage className="w-8 h-8 mb-1" />
                                        <span className="text-xs">이미지 업로드</span>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    {...register("thumbnail", {
                                        required: "썸네일을 선택해주세요.",
                                    })}
                                />

                                {/* 호버 시 안내 */}
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-sm font-medium pointer-events-none">
                                    변경하기
                                </div>
                            </div>
                            {errors.thumbnail && (
                                <p className="text-error-main text-xs">
                                    {errors.thumbnail.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 해시 태그 */}
                    <div className={"space-y-2"}>
                        <label className={twMerge(["block", "text-sm", "font-medium"])}>
                            해시태그
                        </label>

                        <div
                            className={twMerge(
                                ["flex", "flex-wrap", "gap-2", "p-3"],
                                ["border", "border-divider", "rounded-md"],
                                // focus-within 접두사 : 내 안의 자식들까지 포함해서 focus가 걸리면 발동
                                ["focus-within:border-secondary-main"],
                            )}>
                            {/* 해시태그 자체 */}
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className={twMerge(
                                        ["flex", "items-center", "gap-1"],
                                        ["bg-secondary-main/10", "text-secondary-main"],
                                        ["px-2", "py-1", "rounded-full", "text-sm"],
                                    )}>
                                    #{tag}
                                    <button
                                        type={"button"}
                                        onClick={() => removeTag(tag)}
                                        className={twMerge(["hover:text-error-main"])}>
                                        &times;
                                    </button>
                                </span>
                            ))}

                            {/* input */}
                            <input
                                value={tagInput}
                                onChange={event => setTagInput(event.target.value)}
                                // onKeyDown : 키보드를 누르면 발동시킬 함수를 작성
                                onKeyDown={handleKeyDown}
                                placeholder={"태그 입력 후 엔터 (예:브이로그)"}
                                className={twMerge(["flex-1", "min-w-30", "outline-none"])}
                            />
                        </div>
                    </div>

                    <div className={twMerge(["flex", "justify-end", "gap-2"])}>
                        <Button type={"button"} variant={"ghost"}
                        onClick={() => navigate("/")}
                        >
                            취소
                        </Button>
                        <Button type={"submit"} disabled={isSubmitting}>
                            {isSubmitting ? "업로드 중..." : "업로드"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VideoUpload;
