import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Stethoscope, Hospital, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-2">
          <Stethoscope className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold ml-4 font-headline">
            MediVue
          </h1>
        </div>
        <p className="text-xl text-muted-foreground font-headline">NeoNurse</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Individual User</CardTitle>
            <CardDescription>
              Access a specific patient's monitoring dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/login/patient">Patient Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="items-center text-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
             <Hospital className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Hospital / Admin</CardTitle>
            <CardDescription>
              Oversee all patient dashboards and manage beds.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/login/hospital">Hospital Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} MediVue NeoNurse. All rights reserved.</p>
      </footer>
    </div>
  );
}
