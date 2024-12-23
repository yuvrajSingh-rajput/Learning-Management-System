import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [registerUser, 
        {
            data: registerData, 
            error: registerError, 
            isLoading: registerIsLoading,
            isSuccess: registerIsSuccess,
        }] = useRegisterUserMutation();

    const [loginUser, 
        {
            data: loginData, 
            error: loginError, 
            isLoading: loginIsLoading, 
            isSuccess: loginIsSuccess,
        }] = useLoginUserMutation();

    const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        } else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    }

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;

        const action = type === "signup" ? registerUser : loginUser;

        await action(inputData);
    }

    useEffect(() => {
        if(registerIsSuccess && registerData){
            toast.success(registerData.message || "Registration Successful.");
            navigate("/login");
        }
        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login Successful.");
            navigate("/");
        }
        if(registerError){
            toast.error(registerData.data.message || "Error in registration");
        }
        if(loginError){
            toast.error(loginData.data.message || "Error in login");
        }
    }, [registerIsLoading, loginIsLoading, registerData, loginData]);

    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click Signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={signupInput.name}
                                    placeholder="E.g. Yuvraj Singh"
                                    required="true"
                                    onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={signupInput.email}
                                    placeholder="E.g. yuvrajsingh@gmail.com"
                                    required="true"
                                    onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Password</Label>
                                <Input
                                    type='password'
                                    id="password"
                                    name="password"
                                    value={signupInput.password}
                                    placeholder="********"
                                    required="true"
                                    onChange={(e) => changeInputHandler(e, "signup")} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")} >{
                                registerIsLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
                                    </> 
                                ) : "Signup"
                        }</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here. After signup you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={loginInput.email}
                                    placeholder="E.g. yuvrajsingh@gmail.com"
                                    required="true"
                                    onChange={(e) => changeInputHandler(e, "login")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input
                                    id="new"
                                    name="password"
                                    value={loginInput.password}
                                    type="password"
                                    placeholder="*******"
                                    onChange={(e) => changeInputHandler(e, "login")} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleRegistration("login")} >{
                                loginIsLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
                                    </> 
                                ) : "Login"
                        }</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login;