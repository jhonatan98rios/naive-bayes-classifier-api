import natural from 'natural'
import { AbstractClassifierRepository } from '../domain/repositories/AbstractClassifierRepository'
import { AbstractStorageProvider } from '../domain/providers/AbstractStorageProvider'
import { handlePromise } from '../utils/handlePromise'
import { Classifier } from '../domain/entity/Classifier'
import { ClassifyDto } from '../domain/dtos/classify.dto'

export class ModelClassifierService {

    constructor(private classifierRepository: AbstractClassifierRepository, private storageProvider: AbstractStorageProvider) {}

    public async execute(body: ClassifyDto) {

        const { sample, id } = body

        const [err1, foundClassifier] = await handlePromise<Classifier>(this.classifierRepository.readOneById(id))
        if (err1) throw new Error(JSON.stringify({ message: "Model does not exist:", error: err1 }))
        
        
        console.log('foundClassifier: ', foundClassifier)

        const [err2, object] = await handlePromise<Uint8Array>(this.storageProvider.getObject(foundClassifier.path))
        if (!err2) throw new Error(JSON.stringify({ message: "S3 object does not exist", error: err2 }))

        try {
            const classifier = this.getClassifierFromObject(object)
            const result = classifier.classify(sample)
            return { classification: result }
        }
        catch (err3) {
            throw new Error(`Error to classify: ${err2}`)
        }
    }

    private getClassifierFromObject(object: Uint8Array) {
        const stringifiedModel = Buffer.from(object).toString()
        return JSON.parse(stringifiedModel) as natural.BayesClassifier
    }
}
