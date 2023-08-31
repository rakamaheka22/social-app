export const waitUntil = (duration: number) => {
    return new Promise((resolve) => setTimeout(resolve, duration))
}