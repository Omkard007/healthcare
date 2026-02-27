export function calculateBMI(weightKg: number, heightCm: number): number {
    return weightKg / Math.pow(heightCm / 100, 2);
}

export function getBMICategory(bmi: number): "Underweight" | "Normal" | "Overweight" | "Obese" {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female' | 'other'): number {
    const isMale = gender === 'male' || gender === 'other'; // Simplified fallback for other
    if (isMale) {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
}

export function calculateDailyCalories(
    bmr: number,
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'diabetic_friendly'
): number {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    const tdee = bmr * multipliers[activityLevel];

    switch (goal) {
        case 'fat_loss':
            return tdee - 500;
        case 'muscle_gain':
            return tdee + 300;
        case 'diabetic_friendly':
            return tdee - 200;
        case 'maintenance':
        default:
            return tdee;
    }
}
