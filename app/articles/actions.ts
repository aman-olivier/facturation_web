"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getArticles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    return []
  }
  return data
}

export async function addArticle(data: any) {
  const supabase = await createClient()
  await supabase.from('articles').insert([{
    code_article: data.code_article,
    nom_article: data.nom_article,
    designation: data.designation,
    prix_unitaire: data.prix_unitaire || 0
  }])
  revalidatePath('/articles')
  revalidatePath('/quotes/[id]', 'page')
}

export async function updateArticle(id: string, data: any) {
  const supabase = await createClient()
  await supabase.from('articles').update({
    code_article: data.code_article,
    nom_article: data.nom_article,
    designation: data.designation,
    prix_unitaire: data.prix_unitaire
  }).eq('id', id)
  revalidatePath('/articles')
  revalidatePath('/quotes/[id]', 'page')
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()
  await supabase.from('articles').delete().eq('id', id)
  revalidatePath('/articles')
  revalidatePath('/quotes/[id]', 'page')
}
