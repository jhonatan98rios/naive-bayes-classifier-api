import natural from 'natural'
import { AbstractClassifierRepository } from '../domain/repositories/AbstractClassifierRepository'
import { AbstractStorageProvider } from '../domain/providers/AbstractStorageProvider'
import { handlePromise } from '../utils/handlePromise'
import { Classifier } from '../domain/entity/Classifier'
import { ClassifyDto } from '../domain/dtos/classify.dto'
import { InternalServerError, NotFoundError, ParseError } from 'elysia'

export class ModelClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository, private storageProvider: AbstractStorageProvider) {}

    public async execute(body: ClassifyDto) {

        const { sample, id } = body

        const [readOneByIdError, foundClassifier] = await handlePromise<Classifier>(this.classifierRepository.readOneById(id))
        if (readOneByIdError) throw new NotFoundError(`Model does not exist: ${readOneByIdError}`)

        const [getObjectError, object] = await handlePromise<Uint8Array>(this.storageProvider.getObject(foundClassifier.path))
        if (getObjectError) throw new NotFoundError(`S3 object does not exist: ${getObjectError}`)

        const classifier = this.getClassifierFromObject(object)
        return this.executeClassification(classifier, sample)
    }

    private getClassifierFromObject(object: Uint8Array) {
        try {
            const stringifiedModel = Buffer.from(object).toString()
            return JSON.parse(stringifiedModel) as natural.BayesClassifier
        } catch (err) {
            throw new ParseError(`Error while parsing: ${err}`)
        }
    }

    private executeClassification(classifier: natural.BayesClassifier, sample: string) {
        try {
            const result = classifier.classify(sample)
            return { classification: result }
        } catch (err) {
            throw new InternalServerError(`Error to classify: ${err}`)
        }
    }
}
