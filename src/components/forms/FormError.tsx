import * as React from "react"
import { AlertCircle } from "lucide-react"

interface FormErrorProps {
    message?: string;
}

export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return (
        <div className="bg-red-50 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-700 mb-4">
            <AlertCircle className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
}
