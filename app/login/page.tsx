import { login } from './actions'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-2 pb-6 pt-8 px-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">WF</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Bienvenue sur WebFacturation
          </CardTitle>
          <CardDescription className="text-gray-500">
            Connectez-vous à votre compte.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form className="space-y-6 flex flex-col">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">Adresse Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="vous@entreprise.com"
                  className="h-11 focus-visible:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-900 font-medium">Mot de passe</Label>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="h-11 focus-visible:ring-blue-600"
                />
              </div>
            </div>

            {searchParams?.message && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                {searchParams.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button formAction={login} className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm w-full">
                Se connecter
              </Button>
              <Link href="/signup" className="w-full">
                <Button type="button" variant="outline" className="h-11 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium w-full">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
