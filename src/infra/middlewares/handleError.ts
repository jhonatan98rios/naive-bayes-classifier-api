type Code = "UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE"

type IMiddleware = {
    code: Code
    error: Error
    set: any
}

export const handleError = ({ code, error, set }: IMiddleware) => {
    console.error(error);

    if (code === 'NOT_FOUND') {
        set.status = 404
        return 'Not Found :('
    }

    return new Response(error.toString())
}
