"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { FormError } from "./FormError"
import { upsertHealthProfile } from "@/actions/profile.actions"

const formSchema = z.object({
    age: z.coerce.number().min(10).max(100),
    gender: z.enum(["male", "female", "other"]),
    heightCm: z.coerce.number().min(100).max(250),
    weightKg: z.coerce.number().min(20).max(300),
    activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
    sleepHours: z.coerce.number().min(1).max(24),
    conditions: z.array(z.string()).min(1),
    allergies: z.string().optional(),
    smoking: z.boolean(),
    alcohol: z.boolean(),
    fitnessGoal: z.enum(["fat_loss", "muscle_gain", "maintenance", "diabetic_friendly"]),
})

type FormData = z.infer<typeof formSchema>

export function HealthProfileForm() {
    const router = useRouter()
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            conditions: ["none"],
            smoking: false,
            alcohol: false,
            allergies: "",
        }
    })

    const watchConditions = watch("conditions")

    const onSubmit = async (data: FormData) => {
        setServerError(null)

        const payload = {
            ...data,
            allergies: data.allergies ? data.allergies.split(",").map(a => a.trim()).filter(Boolean) : [],
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await upsertHealthProfile(payload as any)
        if (res.success) {
            router.push("/dashboard")
            router.refresh()
        } else {
            setServerError(res.error || "Something went wrong")
        }
    }

    const handleConditionChange = (value: string, checked: boolean) => {
        let current = [...watchConditions]
        if (value === "none") {
            current = checked ? ["none"] : []
        } else {
            current = current.filter(c => c !== "none")
            if (checked) {
                current.push(value)
            } else {
                current = current.filter(c => c !== value)
            }
        }
        if (current.length === 0) current = ["none"]
        setValue("conditions", current, { shouldValidate: true })
    }

    const conditionOptions = [
        { label: "Diabetes", value: "diabetes" },
        { label: "Hypertension", value: "hypertension" },
        { label: "Asthma", value: "asthma" },
        { label: "Thyroid", value: "thyroid" },
        { label: "PCOD", value: "pcod" },
        { label: "Heart Disease", value: "heart_disease" },
        { label: "None", value: "none" },
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormError message={serverError || undefined} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Age"
                    type="number"
                    {...register("age")}
                    error={errors.age?.message}
                />

                <Select
                    label="Gender"
                    {...register("gender")}
                    error={errors.gender?.message}
                    options={[
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                    ]}
                />

                <Input
                    label="Height (cm)"
                    type="number"
                    step="0.1"
                    {...register("heightCm")}
                    error={errors.heightCm?.message}
                />

                <Input
                    label="Weight (kg)"
                    type="number"
                    step="0.1"
                    {...register("weightKg")}
                    error={errors.weightKg?.message}
                />

                <Select
                    label="Activity Level"
                    {...register("activityLevel")}
                    error={errors.activityLevel?.message}
                    options={[
                        { label: "Sedentary", value: "sedentary" },
                        { label: "Lightly Active", value: "light" },
                        { label: "Moderately Active", value: "moderate" },
                        { label: "Active", value: "active" },
                        { label: "Very Active", value: "very_active" },
                    ]}
                />

                <Input
                    label="Sleep Hours per Night"
                    type="number"
                    step="0.5"
                    {...register("sleepHours")}
                    error={errors.sleepHours?.message}
                />

                <Select
                    label="Fitness Goal"
                    {...register("fitnessGoal")}
                    error={errors.fitnessGoal?.message}
                    options={[
                        { label: "Fat Loss", value: "fat_loss" },
                        { label: "Muscle Gain", value: "muscle_gain" },
                        { label: "Maintenance", value: "maintenance" },
                        { label: "Diabetic Friendly", value: "diabetic_friendly" },
                    ]}
                />

                <Input
                    label="Allergies (comma separated)"
                    type="text"
                    placeholder="e.g. peanuts, dairy"
                    {...register("allergies")}
                    error={errors.allergies?.message}
                />
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium leading-none text-slate-800">
                    Medical Conditions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {conditionOptions.map((opt) => (
                        <label key={opt.value} className="flex items-center space-x-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                                checked={watchConditions.includes(opt.value)}
                                onChange={(e) => handleConditionChange(opt.value, e.target.checked)}
                            />
                            <span>{opt.label}</span>
                        </label>
                    ))}
                </div>
                {errors.conditions?.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.conditions.message}</p>
                )}
            </div>

            <div className="flex gap-6">
                <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        {...register("smoking")}
                    />
                    <span>Do you smoke?</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                        {...register("alcohol")}
                    />
                    <span>Do you consume alcohol?</span>
                </label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
        </form>
    )
}
