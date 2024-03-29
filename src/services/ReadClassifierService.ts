import { Classifier } from "../domain/entity/Classifier"
import { AbstractClassifierRepository } from "../domain/repositories/AbstractClassifierRepository"
import { handlePromise } from "../utils/handlePromise"

export class ReadClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository) {}

    public async execute(id: string, username: string) {

        const [err, classifier] = await handlePromise<Classifier>(this.classifierRepository.readOneById(id))

        if (err) {
            throw new Error(`Read classifier by ID error: ${err}`)
        }

        if (!classifier?.isPublic && !classifier?.owners.includes(username)) {
            console.log("Acesso negado")
            throw new Error('Access Denied!')
        }

        return classifier
    }
}