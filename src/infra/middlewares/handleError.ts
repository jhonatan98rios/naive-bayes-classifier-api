type Code = "UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE"

type IMiddleware = {
    code: Code
    error: Error
    set: any
}

export const handleError = ({ code, error, set }: IMiddleware) => {
    set.status = 500
    if (code == "NOT_FOUND") set.status = 404
    if (code == "INVALID_COOKIE_SIGNATURE") set.status = 403

    return new Response(error.toString())
}
