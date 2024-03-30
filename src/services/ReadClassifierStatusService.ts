import { NotFoundError, InternalServerError } from "elysia"
import { Classifier, STATUS } from "../domain/entity/Classifier"
import { AbstractClassifierRepository } from "../domain/repositories/AbstractClassifierRepository"
import { handlePromise } from "../utils/handlePromise"

export class ReadClassifierStatusService {

    constructor(private classifierRepository: AbstractClassifierRepository) {}

    public async execute(id: string) {

        const [err, classifier] = await handlePromise<Classifier>(this.classifierRepository.readOneById(id))
        if (err) throw new InternalServerError(`Read classifier status error: ${err}`)
        if (!classifier) throw new NotFoundError(`Invalid ID: ${id}`)

        return { status: classifier.status ?? STATUS.FAILED }
    }
}