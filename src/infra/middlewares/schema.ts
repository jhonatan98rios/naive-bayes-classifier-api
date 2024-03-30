import { t } from 'elysia'

export const readClassifierSchema = {
    params: t.Object({
        id: t.String()
    })
}

export const readClassifierStatusSchema = {
    params: t.Object({
        id: t.String()
    })
}
