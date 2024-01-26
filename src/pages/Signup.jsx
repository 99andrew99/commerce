import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 비밀번호 유효성 검사를 위한 정규표현식
const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{10,}$/;

// Zod를 사용하여 양식 스키마 정의
const formSchema = z.object({
    password: z
        .string()
        .regex(
            passwordRegex,
            "비밀번호는 10자 이상이며 대문자, 소문자, 숫자, 특수문자 중 2종류 이상을 포함해야 합니다."
        ),
    nickname: z
        .string()
        .min(2)
        .max(10, "닉네임은 2글자 이상 10자 이하여야 합니다."),
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
});

// React 컴포넌트
function Signup() {
    const navigate = useNavigate();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            nickname: "",
            email: "",
        },
    });

    const handleConfirm = () => {
        // alert 창 닫고 로그인 창 이동
        setIsAlertOpen(false);
        navigate("/login");
    };

    // 제출 핸들러 정의
    function onSubmit(values) {
        console.log(values);

        const { email, password, nickname } = values;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("회원가입 성공");
                // 사용자 생성 성공
                const user = userCredential.user;
                // Firestore에 닉네임과 이메일 저장
                setDoc(doc(db, "users", user.uid), {
                    nickname: nickname,
                });

                setIsAlertOpen(true);
            })
            .catch((error) => {
                console.error("회원가입 실패", error);
            });
    }

    const googleSignUp = () => {
        const provider = new GoogleAuthProvider(); // provider를 구글로 설정
        signInWithPopup(auth, provider) // popup을 이용한 signup
            .then((data) => {
                // setUserData(data.user); // user data 설정
                console.log(data); // console로 들어온 데이터 표시
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen ">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8  w-1/3 h-2/5 ml-auto mr-auto"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="유효한 이메일을 입력해주세요."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="10자리 이상 대문자,소문자,숫자,특수문자 중 2종류 이상 입력해주세요."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nickname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>닉네임</FormLabel>
                                <FormControl>
                                    <Input
                                        type="nickname"
                                        placeholder="닉네임을 2글자 이상 10자 이하로 입력해주세요."
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center items-center">
                        <Button type="submit" style={{ width: "50%" }}>
                            회원가입하기
                        </Button>
                    </div>
                </form>
            </Form>
            <Link
                className={`mt-4 ${buttonVariants({ variant: "link" })}`}
                to="/login"
            >
                로그인하기
            </Link>

            <div className="mt-4">
                <Button onClick={googleSignUp} style={{ width: "100%" }}>
                    구글 회원가입
                </Button>
            </div>

            {isAlertOpen && (
                <AlertDialog open={isAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>회원가입 완료</AlertDialogTitle>
                            <AlertDialogDescription>
                                회원가입에 성공했습니다.
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

export default Signup;
