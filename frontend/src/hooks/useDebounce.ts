// hooks/useDebounce.ts
import { useEffect, DependencyList } from 'react'

export const useDebounce = (
    callback: () => void,
    delay: number,
    deps: DependencyList
) => {
    useEffect(() => {
        const timer = setTimeout(callback, delay)
        return () => clearTimeout(timer)
    }, deps)
}