import { Card, CardHeader, CardTitle, CardContent } from "./Card"

export function ComingSoonCard({ title, description }: { title: string; description: string }) {
    return (
        <Card className="max-w-md mx-auto mt-10 text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-500 mb-6">{description}</p>
                <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    Coming in Version 2
                </div>
            </CardContent>
        </Card>
    )
}
