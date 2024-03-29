import { Classifier } from "../domain/entity/Classifier"
import { AbstractClassifierRepository } from "../domain/repositories/AbstractClassifierRepository"
import { handlePromise } from "../utils/handlePromise"

export class ListClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository) {}

    public async execute(username?: string) {
        const [err, list] = await handlePromise<Classifier[]>(this.classifierRepository.readAll())

        if (err) {
            throw new Error(`List classifiers error: ${err}`)
        }

        const filteredList = username ? list.filter(item => item.isPublic || item.owners.includes(username)) : list
        return filteredList.reverse()
    }
}