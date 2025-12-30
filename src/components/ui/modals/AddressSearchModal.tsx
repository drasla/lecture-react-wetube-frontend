import { twMerge } from "tailwind-merge";
import DaumPostcodeEmbed from "react-daum-postcode";

type AddressSearchModalProps = {
    props: any;
    onClose: VoidFunction;
};

function AddressSearchModal({ props, onClose }: AddressSearchModalProps) {
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 우편번호는 data.zonecode
        // 기본주소는 fullAddress

        props.onComplete({
            zonecode: data.zonecode,
            address: fullAddress
        });
        onClose();
    }

    return (
        <div
            className={twMerge(
                ["w-full", "p-4"],
                ["bg-background-paper", "rounded-lg", "shadow-xl"],
                ["border", "border-divider"],
            )}>
            <h2 className={twMerge(["text-lg", "font-bold", "mb-4"])}>주소 검색</h2>
            <div className={twMerge(["h-[400px]", "border", "border-divider"])}>
                <DaumPostcodeEmbed onComplete={handleComplete} />
            </div>
        </div>
    );
}

export default AddressSearchModal;
