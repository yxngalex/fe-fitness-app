import {DialogFooter} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {UserDTO} from "@/model/UserDTO.ts";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {GoalDTO} from "@/model/GoalDTO.ts";
import {registerUser} from "@/api/auth/auth.redaxios.ts";
import {Label} from "@/components/ui/label.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandItem} from "@/components/ui/command.tsx";
import {useEffect, useState} from "react";
import {getBodyType} from "@/api/bodyType/bodyType.redaxios.ts";

interface Goal {
    userToSave: UserDTO,
    setDialogOpen: (value: boolean) => void
}

const Goal = ({userToSave, setDialogOpen}: Goal) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [bodyTypes, setBodyTypes] = useState([]);

    useEffect(() => {
        let mounted = true;

        getBodyType().then(data => {
            if (mounted) {
                setBodyTypes(data)
                mounted = false;
            }
        })
    }, []);

    const formSchema = z.object({
        weightGoal: z.string(),
        bodyTypeGoal: z.string(),
        weeklyExercise: z.string()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weightGoal: "",
            bodyTypeGoal: "",
            weeklyExercise: ""
        },
    })
    const saveUserWithGoal = (v: z.infer<typeof formSchema>) => {
        const goal: GoalDTO = {
            weightGoal: Number(v.weightGoal),
            bodyTypeGoal: value.toUpperCase(),
            weeklyExercises: Number(v.weeklyExercise)
        };

        console.log(goal)

        userToSave.goal = goal;

        console.log(userToSave)

        registerUser(userToSave).then(response => {
            console.log(response);
        });

        setDialogOpen(false)
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(saveUserWithGoal)}
                      className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
                    <div>
                        <div className="pb-2 pt-4 flex-1 mr-2">
                            <FormField
                                control={form.control}
                                name="weightGoal"
                                render={({field}) => (
                                    <FormItem>
                                        <Label>What's your weight goal? (Kilograms)</Label>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="..." {...field}
                                                className="block w-full h-full p-4 text-lg rounded-sm bg-black text-white placeholder:text-zinc-100 hover:bg-gray-900"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 flex-1">
                            <FormField
                                control={form.control}
                                name="weeklyExercise"
                                render={({field}) => (
                                    <FormItem>
                                        <Label>How many times a week would you like to exercise? (1 - 6 days)</Label>
                                        <FormControl>
                                            <Input type="number" placeholder="..." {...field}
                                                   className="block w-full h-full p-4 text-lg rounded-sm text-white bg-black placeholder:text-zinc-100 hover:bg-gray-900"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}></FormField>
                        </div>
                        <div className="pb-2 pt-4 mr-2 flex-1">
                            <div>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <div>
                                        <Label>What's your weight goal?</Label>
                                        <PopoverTrigger asChild>
                                            <Button
                                                role="combobox"
                                                aria-expanded={open}
                                                className="justify-between w-full h-full text-lg bg-black rounded-sm placeholder:text-zinc-100 hover:bg-gray-900 mt-2"
                                            >
                                                Weight Goal
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[250px] p-0">
                                            <Command>
                                                <CommandGroup>
                                                    {bodyTypes.map((bodyType) => (
                                                        <CommandItem
                                                            key={bodyType}
                                                            value={bodyType}
                                                            onSelect={(currentValue) => {
                                                                setValue(currentValue === value ? "" : currentValue)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            {bodyType}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </div>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter className="mt-14 text-center">
                            <Button className="mx-auto" type="submit">Save</Button>
                        </DialogFooter>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default Goal;