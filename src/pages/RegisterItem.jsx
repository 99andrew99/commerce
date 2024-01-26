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

const formSchema = z.object({
    name: z.string().min(1),
    cost: z.number(),
    stock: z.number(),
    description: z.string().min(1),
});

function RegisterItem() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            name: "",
            cost: 0,
            stock: 0,
            description: "",
        },
    });

    useEffect(() => {
        form.register("category");
        form.register("file");
    }, [form.register]);

    const [selectedFiles, setSelectedFiles] = useState();

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
        // form.setValue("file", event.target.files);
    };

    const handleCategoryChange = (value) => {
        form.setValue("category", value);
    };

    const onSubmit = (data) => {
        console.log(data);
        console.log(selectedFiles);
    };

    return (
        <div className="w-screen h-screen bg-red-400 flex flex-row justify-start flex-col items-center">
            <div>상품 등록</div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-blue-400 w-1/3"
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
        </div>
    );
}

export default RegisterItem;
