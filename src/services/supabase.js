import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan credenciales de Supabase en el .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export function getAccessToken() {
  return localStorage.getItem('rey_paletas_access_token')
}

export function getRefreshToken() {
  return localStorage.getItem('rey_paletas_refresh_token')
}

export async function setSupabaseSession() {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    
    if (error) {
      console.error('Error setting Supabase session:', error)
      return false
    }
    return true
  }
  return false
}

export async function uploadImage(file, bucket = 'Products', folder = '') {
  if (!file) return null

  const hasSession = await setSupabaseSession()
  if (!hasSession) {
    console.error('No hay sesión de Supabase configurada')
    return null
  }

  const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return data?.publicUrl || null
}

export function getFileNameFromUrl(url) {
  if (!url) return null
  const parts = url.split('/')
  return parts[parts.length - 1] || null
}

export async function deleteImage(bucket, url) {
  const fileName = getFileNameFromUrl(url)
  if (!fileName) return false

  const hasSession = await setSupabaseSession()
  if (!hasSession) {
    console.error('No hay sesión de Supabase configurada')
    return false
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])

  if (error) {
    console.error('Error deleting image:', error)
    return false
  }

  return true
}