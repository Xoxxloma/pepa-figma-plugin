export const createUrlSearchParams = (values: Record<string, any>): string => {
    return Object.keys(values).reduce((acc, val) => {
        acc += `${val}=${values[val]}`
        return acc;
    }, '?')
}
