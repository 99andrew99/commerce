import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    updateDoc,
    setDoc,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { db, storage } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { LoadingSpinner } from "@/components/ui/loading";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string().min(1),
    cost: z.number(),
    stock: z.number(),
    description: z.string().min(1),
});

function ItemModify() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [firstLoading, setFirstLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [existingFileUrls, setExistingFileUrls] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState();
    const [categoryValue, setCategoryValue] = useState("식품");
    const [createdId, setCreateId] = useState("");
    // const handleFileChange = (event) => {
    //     setSelectedFiles(event.target.files);
    //     // form.setValue("file", event.target.files);
    // };

    const handleConfirm = () => {
        // alert 창 닫고 로그인 창 이동
        setIsAlertOpen(false);
        navigate(-1);
    };

    const handleCategoryChange = (value) => {
        // form.setValue("category", value);
        setCategoryValue(value);
    };

    const handleFileChange = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return; // 파일이 선택되지 않았다면 함수 종료

        // 기존 파일을 Storage에서 삭제
        for (let url of fileUrl) {
            const fileRef = ref(storage, url);
            deleteObject(fileRef).catch((error) => {
                console.error("파일 삭제 중 에러 발생:", error);
            });
            console.log("파일 삭제됨");
        }

        // 새 파일 업로드
        const uploadedUrls = [];
        setIsLoading(true); // 로딩 상태 활성화
        for (let file of files) {
            const currentTime = currentTimeFunc();
            const imageRef = ref(storage, `images/${file.name}_${currentTime}`);
            try {
                await uploadBytes(imageRef, file); // 파일 업로드
                const downloadUrl = await getDownloadURL(imageRef); // 업로드된 파일의 URL 가져오기
                uploadedUrls.push(downloadUrl);
            } catch (error) {
                console.error("업로드 중 에러 발생:", error);
            }
        }

        setFileUrl(uploadedUrls); // 업로드된 파일 URL 상태 업데이트
        setIsLoading(false); // 로딩 상태 비활성화
    };

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

    async function fetchItem() {
        const docRef = doc(db, "sale", itemId);

        await getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    setItem(docSnap.data());
                    handleCategoryChange(docSnap.data().category);
                    form.setValue("category", docSnap.data().category);
                    form.setValue("name", docSnap.data().name);
                    form.setValue("cost", docSnap.data().cost);
                    form.setValue("stock", docSnap.data().stock);
                    form.setValue("description", docSnap.data().description);
                    setFileUrl(docSnap.data().file.split(","));

                    setCreateId(
                        docSnap
                            .data()
                            .id.substring(docSnap.data().id.length - 19)
                    );
                    // form.setValue(docSnap.data().file.split(","));

                    console.log("아이템 수정 페이지 정상동작");

                    setFirstLoading(true);
                } else {
                    console.log("아이템 수정 페이지 getDoc 상품 존재 에러");
                }
            })
            .catch((error) => {
                console.log(
                    "아이템 수정 페이지 getDoc 상품 존재 에러 : ",
                    error
                );
            });
    }

    useEffect(() => {
        fetchItem();
    }, [itemId]);

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
        if (fileUrl == null) {
            alert("사진을 등록해주세요.");
            return;
        }
        console.log("tttttttt");
        setIsLoading(true);
        const currentTime = currentTimeFunc();
        setDoc(
            doc(db, "sale", `${currentUser.uid}_${data.name}_${createdId}`),
            {
                category: categoryValue,
                name: data.name,
                cost: data.cost,
                stock: data.stock,
                description: data.description,
                file: fileUrl.join(","),
                uid: currentUser.uid,
                createdAt: createdId,
                id: `${currentUser.uid}_${data.name}_${createdId}`,
                modified: serverTimestamp(),
            }
        );

        setIsLoading(false);
        setIsAlertOpen(true);
    };

    return (
        firstLoading && (
            <div className="w-screen h-screen flex flex-row justify-start flex-col items-center">
                <div>상품 수정</div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" w-1/3"
                    >
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
                                        defaultValue={
                                            field.value || item.category
                                        }
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
                                    <FormLabel>
                                        상품 이름을 입력하세요.
                                    </FormLabel>
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
                                        상품 가격을 입력하세요.(숫자를
                                        입력해주세요 ex) 17000)
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
                                        대표 상품 이미지를 선택하세요. (여러장
                                        가능)
                                    </FormLabel>

                                    <Carousel className="w-28 h-32 ml-auto mr-auto ">
                                        <CarouselContent>
                                            {fileUrl.map((url, index) => (
                                                <CarouselItem>
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        className="w-28 h-32 border border-black"
                                                    />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious type="button" />
                                        <CarouselNext type="button" />
                                    </Carousel>
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
                                상품 수정하기
                            </Button>
                        </div>
                    </form>
                </Form>

                {
                    isLoading && (
                        <div className="fixed top-0 bg-black w-screen h-screen flex flex-col justify-center items-center">
                            <LoadingSpinner className={"bg-white z-20"} />
                            <div className="text-white mt-4">
                                상품 수정중입니다...
                            </div>
                        </div>
                    ) // 로딩 인디케이터 표시
                }

                {isAlertOpen && (
                    <AlertDialog open={isAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    상품 수정 완료
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    상품 수정에 성공했습니다.
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
        )
    );
}

export default ItemModify;
