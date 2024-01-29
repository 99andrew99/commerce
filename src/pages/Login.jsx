import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
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

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    browserLocalPersistence,
    setPersistence,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
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
    email: z.string().email("유효한 이메일 주소를 입력해주세요."),
});

// React 컴포넌트
function Login() {
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            email: "",
        },
    });

    // 제출 핸들러 정의
    function onSubmit(values) {
        console.log(values);

        const { email, password } = values;

        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log("실행은 됨");

                return signInWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // 사용자 생성 성공
                        const user = userCredential.user;
                        console.log("로그인 성공", userCredential);
                        navigate("/home");
                        // Firestore에 닉네임과 이메일 저장
                        // setDoc(doc(db, "users", user.uid), {
                        //     nickname: nickname,
                        // });

                        // setIsAlertOpen(true);
                    })
                    .catch((error) => {
                        console.error("회원가입 실패", error);
                    });
            })
            .catch((error) => {
                console.log("setpersistence 에러", error);
            });
    }

    const googleSignIn = () => {
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
                    className="space-y-8  w-1/3 h-2/6 ml-auto mr-auto"
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
                                        placeholder="이메일"
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
                                        placeholder="비밀번호"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center items-center">
                        <Button type="submit" style={{ width: "50%" }}>
                            로그인하기
                        </Button>
                    </div>
                </form>
            </Form>
            <Link
                className={`mt-4 ${buttonVariants({ variant: "link" })}`}
                to="/signup"
            >
                회원가입하기
            </Link>

            <div className="mt-4">
                <Button onClick={googleSignIn} style={{ width: "100%" }}>
                    구글 로그인
                </Button>
            </div>
        </div>
    );
}

export default Login;
