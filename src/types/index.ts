export interface UserData {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface HealthProfileInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  sleepHours: number;
  conditions: string[];
  allergies: string[];
  smoking: boolean;
  alcohol: boolean;
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'diabetic_friendly';
}

export interface HealthProfileData extends HealthProfileInput {
  id: string;
  userId: string;
  bmi: number;
  bmr: number;
  dailyCalories: number;
  updatedAt: Date;
}

export interface BMIResult {
  bmi: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obese";
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
}
