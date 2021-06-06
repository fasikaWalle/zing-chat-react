import { useEffect, useState } from 'react'

export default function useLocalStorage() {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem('id_token')
    if (jsonValue != null) return JSON.parse(jsonValue)
    return ""
  })
  useEffect(() => {
    localStorage.setItem('id_token', JSON.stringify(value))
  }, ['id_token', value])

  return [value, setValue]
}