export const getImageUrl = (url) => {
    if (!url) return '/placeholder.jpg'
    if (url.startsWith('http')) return url
    return `http://localhost:5000${url}`
}