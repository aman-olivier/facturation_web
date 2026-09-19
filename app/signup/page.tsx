import { signup } from './actions'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg shadow-xl border-none">
        <CardHeader className="space-y-2 pb-6 pt-8 px-8 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">WF</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-gray-500">
            Rejoignez WebFacturation et commencez à gérer vos devis et factures.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form className="space-y-6 flex flex-col">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-medium">Votre nom</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    required 
                    placeholder="Jean Dupont"
                    className="h-11 focus-visible:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-900 font-medium">Nom de l'entreprise</Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    type="text" 
                    required 
                    placeholder="Mon Entreprise"
                    className="h-11 focus-visible:ring-blue-600"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-900 font-medium">Mot de passe</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="h-11 focus-visible:ring-blue-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="text-gray-900 font-medium">Confirmer le mot de passe</Label>
                  <Input 
                    id="passwordConfirm" 
                    name="passwordConfirm" 
                    type="password" 
                    required 
                    className="h-11 focus-visible:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {searchParams?.message && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">
                {searchParams.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button formAction={signup} className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm w-full">
                Créer mon compte
              </Button>
              <div className="text-center mt-2 text-sm text-gray-500">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
