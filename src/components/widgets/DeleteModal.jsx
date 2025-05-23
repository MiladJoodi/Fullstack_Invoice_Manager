"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa"
import { Input } from "../ui/input";


export default function DeleteModal({ title, desc, pass, onClick }) {

    const [keyword, setKeyword] = useState("");

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <FaTrashAlt size={22} color={"red"} className="cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{desc}</AlertDialogDescription>
                    <p>
                        To Delete: Type <b>{pass}</b> in the input field.
                    </p>
                    <Input
                        className="border-red-600"
                        type="text"
                        placeholder="keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {keyword === pass && (
                        <AlertDialogAction onClick={onClick}>Delete</AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
