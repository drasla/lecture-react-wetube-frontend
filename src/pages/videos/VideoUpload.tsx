import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { MdCloudUpload, MdImage } from "react-icons/md";
import Input from "../../components/ui/Input.tsx";

interface UploadFormData {
    title: string;
    description: string;
    video: FileList;
    thumbnail: FileList;
}

function VideoUpload() {
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

    return (
        <div
            className={twMerge(
                ["min-h-[calc(100dvh-56px)]", "px-4", "py-10"],
                ["flex", "justify-center", "items-center"],
            )}>
            <div className={twMerge(["w-full", "max-w-200", "space-y-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>동영상 업로드</h1>

                <form className={"space-y-8"}>
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
                </form>
            </div>
        </div>
    );
}

export default VideoUpload;
