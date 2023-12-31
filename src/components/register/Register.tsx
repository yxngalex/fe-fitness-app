import {Button} from "@/components/ui/button.tsx";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form"
import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowBigLeftDash, ChevronsUpDown} from "lucide-react";
import {
    Dialog, DialogContent,
    DialogDescription, DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import Goal from "@/components/goal/Goal.tsx";
import {User, UserDTO} from "@/model/UserDTO.ts";
import {GoalDTO} from "@/model/GoalDTO.ts";
import {useEffect, useState} from "react";
import {ZodError} from "zod";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command.tsx";
import {getGenders} from "@/api/gender/gender.redaxios.ts";

interface RegisterProps {
    onToggleView: () => void;
    onRegisterError: (error: string | null) => void;
    onRegisterSuccess: (error: string | null) => void;
}

const Register = ({onToggleView, onRegisterError, onRegisterSuccess}: RegisterProps) => {
    const [user, registerUser] = useState<UserDTO | null>(null);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        let mounted = true;

        getGenders().then(data => {
            if (mounted) {
                setGenders(data)
                mounted = false;
            }
        })
    }, []);

    const handleBackToLogin = () => {
        onToggleView();
    }

    const formSchema = z.object({
        username: z.string().min(5, {
            message: "Username must be at least 5 characters.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters."
        }),
        confPassword: z.string(),
        email: z.string().email({
            message: "Invalid email address"
        }),
        firstName: z.string().min(1, {
            message: "Field can't be empty!"
        }),
        lastName: z.string().min(1, {
            message: "Field can't be empty!"
        }),
        height: z.string().min(1, {
            message: "Field can't be empty!"
        }),
        weight: z.string().min(1, {
            message: "Field can't be empty!"
        }),
        age: z.string().refine(v => {
            const age = parseInt(v, 10);
            return age >= 18 && age <= 99;
        }, {
            message: "Age must be between 18 and 99."
        }),
        gender: z.string().refine(gender => {
            return !!gender
        }, {
            message: "Select a gender!"
        })
    }).refine(data => data.password === data.confPassword, {
        message: "Passwords do not match.",
        path: ["confPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            confPassword: "",
            email: "",
            firstName: "",
            lastName: "",
            height: "",
            weight: "",
            age: "",
            gender: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await form.trigger();

            if (Object.keys(form.formState.errors).length === 0) {

                const userWrapper = new User(values.username, values.password, {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    height: Number(values.height),
                    weight: Number(values.weight),
                    age: Number(values.age),
                    gender: value.toUpperCase(),
                    goal: {} as GoalDTO,
                });

                registerUser(userWrapper);

                onRegisterError(null);
            }
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((err) => {
                    console.error(err.message);
                    onRegisterError(err.message);
                });
            } else {
                console.error(error);
            }
        }
    }

    return (
        <>
            <p className="lg:text-black text-white text-xl">
                Become a member today!
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
                    <div className="flex">
                        <div className="pb-2 pt-4 flex-1 mr-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Username" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 flex-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="pb-2 pt-4 mr-2 flex-1">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="password" placeholder="Password" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 mr-2 flex-1">
                            <FormField
                                control={form.control}
                                name="confPassword"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="password"
                                                   placeholder="Confirm Password" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="pb-2 pt-4 flex-1 mr-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" placeholder="First name" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 flex-1">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="text" placeholder="Last name" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="pb-2 pt-4 flex-1 mr-2">
                            <FormField
                                control={form.control}
                                name="height"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Height in Cm" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 flex-1">
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Weight in Kg" {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="pb-2 pt-4 flex-1 mr-2">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Age" {...field}
                                                   className="appearance-none block w-full h-full p-4 text-lg rounded-sm border-slate-300 hover:border-black placeholder:text-black text-black hover:bg-gray-100"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 flex-1">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({field}) => (
                                    <FormItem>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="justify-between w-full h-14 text-lg bg-white hover:border-2 hover:border-black rounded-sm placeholder:text-black text-black hover:bg-gray-100"
                                                >
                                                    {value ? value.toUpperCase() : "Gender"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[250px] p-0">
                                                <Command>
                                                    <CommandGroup>
                                                        {genders.map((gender) => (
                                                            <CommandItem
                                                                key={gender}
                                                                value={gender}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setOpen(false)
                                                                    field.onChange(currentValue);
                                                                }}
                                                            >
                                                                {gender}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}>
                            </FormField>
                        </div>
                    </div>
                    <div className="px-4 pb-2 pt-6">
                        {Object.keys(form.formState.errors).length === 0 && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="uppercase w-1/2 h-[60px] py-1 text-lg hover:bg-blue-500 focus:outline-none lg:bg-blue-600 bg-blue-600 lg:text-white text-white lg:hover:bg-blue-500"
                                        type="submit"
                                    >
                                        Sign Up</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create a Goal.</DialogTitle>
                                        <DialogDescription>
                                            You need to create a personal goal. Click continue
                                            when you're done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {user && <Goal userToSave={user} onGoalError={onRegisterError}
                                                   onGoalSuccess={onRegisterSuccess}/>}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                    <div className="px-4 pb-2 mt-14 flex justify-center items-center">
                        <Button
                            className="uppercase flex items-center w-1/2 h-[60px] py-1 text-lg hover:bg-slate-500 focus:outline-none lg:bg-slate-600 bg-slate-600 lg:text-white text-white lg:hover:bg-slate-500"
                            onClick={handleBackToLogin}>
                            <ArrowBigLeftDash className="mr-2"/>
                            <span>Back to Login</span>
                        </Button>
                    </div>
                    <div
                        className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden ">
                        <a href="https://www.facebook.com" target="_blank">
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com" target="_blank">
                            <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                 viewBox="0 0 24 24">
                                <path
                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default Register;