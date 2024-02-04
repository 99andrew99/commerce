import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading";

const formSchema = z.object({
    name: z.string().min(1),
    cost: z.number(),
    stock: z.number(),
    description: z.string().min(1),
});

function RegisterItem() {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    console.log("레지스터 유저: ", currentUser);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            name: "",
            cost: "",
            stock: "",
            description: "",
        },
    });

    // useEffect(() => {
    //     form.register("category");
    //     form.register("file");
    // }, [form.register]);

    const handleConfirm = () => {
        // alert 창 닫고 로그인 창 이동
        setIsAlertOpen(false);
        navigate(-1);
    };

    const [selectedFiles, setSelectedFiles] = useState();
    const [fileUrl, setFileUrl] = useState([]);
    const [categoryValue, setCategoryValue] = useState("식품");

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
        // form.setValue("file", event.target.files);
    };

    const handleCategoryChange = (value) => {
        // form.setValue("category", value);
        setCategoryValue(value);
    };

    const currentTimeFunc = () => {
        const currentTimestamp = Date.now(); // 현재 타임스탬프를 얻음
        const currentDate = new Date(currentTimestamp); // 타임스탬프를 Date 객체로 변환

        // 각 부분을 가져와서 두 자리로 포맷팅
        const yyyy = currentDate.getFullYear();
        const MM = String(currentDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 두 자리로 포맷팅
        const dd = String(currentDate.getDate()).padStart(2, "0");
        const HH = String(currentDate.getHours()).padStart(2, "0");
        const mm = String(currentDate.getMinutes()).padStart(2, "0");
        const ss = String(currentDate.getSeconds()).padStart(2, "0");

        // 포맷된 문자열 반환
        const formattedDateTime = `${yyyy}-${MM}-${dd}-${HH}:${mm}:${ss}`;
        return formattedDateTime;
    };

    const onSubmit = async (data) => {
        // console.log("데이터는:", data);
        // console.log(selectedFiles);
        if (selectedFiles == null) {
            alert("사진을 등록해주세요.");
            return;
        }
        setIsLoading(true);
        let tempArr = [];
        let currentTime = currentTimeFunc();
        // console.log("현재 시간: ", currentTime);

        for (let i = 0; i < selectedFiles.length; i++) {
            const imageRef = ref(
                storage,
                `images/${selectedFiles[i].name}_${currentTime}`
            );
            // console.log("imageRef : ", imageRef);
            await uploadBytes(imageRef, selectedFiles[i]);

            const downloadUrl = await getDownloadURL(imageRef);
            console.log("다운로드URL:", downloadUrl);
            tempArr.push(downloadUrl);
        }

        setFileUrl(tempArr);
        console.log("파일 url", tempArr);

        // for (let i = 0; i < fileUrl.length; i++) {
        //     console.log(`${i + 1} 번째 파일 주소는: `, fileUrl[i]);
        // }

        setDoc(
            doc(db, "sale", `${currentUser.uid}_${data.name}_${currentTime}`),
            {
                category: categoryValue,
                name: data.name,
                cost: data.cost,
                stock: data.stock,
                description: data.description,
                file: tempArr.join(","),
                uid: currentUser.uid,
                createdAt: serverTimestamp(),
                id: `${currentUser.uid}_${data.name}_${currentTime}`,
            }
        );

        setIsLoading(false);
        setIsAlertOpen(true);
    };

    return (
        <div className="w-screen h-screen flex flex-row justify-start flex-col items-center">
            <div>상품 등록</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" w-1/3">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    상품의 카테고리를 선택하세요.
                                </FormLabel>
                                <Select
                                    onValueChange={handleCategoryChange}
                                    defaultValue={field.value || "식품"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="카테고리를 선택하세요." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="식품">
                                            식품
                                        </SelectItem>
                                        <SelectItem value="생필품">
                                            생필품
                                        </SelectItem>
                                        <SelectItem value="패션">
                                            패션
                                        </SelectItem>
                                        <SelectItem value="취미">
                                            취미
                                        </SelectItem>
                                        <SelectItem value="뷰티">
                                            뷰티
                                        </SelectItem>
                                        <SelectItem value="디지털">
                                            디지털
                                        </SelectItem>
                                        <SelectItem value="건강">
                                            건강
                                        </SelectItem>
                                        <SelectItem value="스포츠">
                                            스포츠
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>상품 이름을 입력하세요.</FormLabel>
                                <FormControl>
                                    <Input
                                        type="name"
                                        placeholder="상품 이름을 입력하세요."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cost"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    상품 가격을 입력하세요.(숫자를 입력해주세요
                                    ex) 17000)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="상품 가격을 입력하세요. ex) 17000"
                                        {...field}
                                        onChange={(e) => {
                                            let inputValue = e.target.value;
                                            form.setValue(
                                                "cost",
                                                parseInt(inputValue, 10)
                                            );
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    상품 재고 수량을 입력하세요. (숫자를
                                    입력해주세요 ex) 500)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="상품 재고 수량을 입력하세요. ex)500"
                                        {...field}
                                        onChange={(e) => {
                                            let inputValue = e.target.value;
                                            form.setValue(
                                                "stock",
                                                parseInt(inputValue, 10)
                                            );
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    대표 상품 이미지를 선택하세요. (여러장 가능)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="대표 상품 이미지를 선택하세요. (여러장 가능)"
                                        multiple
                                        {...field}
                                        onChange={handleFileChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="mt-5">
                                <FormLabel>
                                    상품 상세 설명을 작성해주세요.
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="h-32"
                                        type="description"
                                        placeholder="상품 상세 설명을 작성해주세요."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center items-center mt-5">
                        <Button type="submit" style={{ width: "50%" }}>
                            상품 등록하기
                        </Button>
                    </div>
                </form>
            </Form>

            {
                isLoading && (
                    <div className="fixed top-0 bg-black w-screen h-screen flex flex-col justify-center items-center">
                        <LoadingSpinner className={"bg-white z-20"} />
                        <div className="text-white mt-4">
                            상품 등록중입니다...
                        </div>
                    </div>
                ) // 로딩 인디케이터 표시
            }

            {isAlertOpen && (
                <AlertDialog open={isAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>상품 등록 완료</AlertDialogTitle>
                            <AlertDialogDescription>
                                상품 등록에 성공했습니다.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={handleConfirm}>
                                확인
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

export default RegisterItem;
