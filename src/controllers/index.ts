import { S3ProviderV2 } from "../infra/providers/S3ProviderV2";
import { MongoDBClassifierRepository } from "../infra/repositories/MongoDBClassifierRepository";
import { ModelClassifierService } from "../services/ModelClassifierService";
import { ListClassifierService } from "../services/ListClassifierService";
import { ReadClassifierStatusService } from "../services/ReadClassifierStatusService";
import { ReadClassifierService } from "../services/ReadClassifierService";
import { ClassifyDto } from "../domain/dtos/classify.dto";

export class ClasssifierController {

    public async list({ set: { username } }: any) {
        console.time('benchmark');
        const classifierRepository = new MongoDBClassifierRepository()
        const listClassifierService = new ListClassifierService(classifierRepository)
        const result = await listClassifierService.execute(username)
        console.timeEnd('benchmark');
        return result
    }

    public async readClassifier({ params: { id }, set: { username } }: any) {
        console.time('benchmark');
        const classifierRepository = new MongoDBClassifierRepository()
        const readClassifierService = new ReadClassifierService(classifierRepository)
        const result = await readClassifierService.execute(id, username)
        console.timeEnd('benchmark');
        return result
    }

    public async readClassifierStatus({ params: { id } }: any) {

        console.time('benchmark');
        const classifierRepository = new MongoDBClassifierRepository()
        const readClassifierStatusService = new ReadClassifierStatusService(classifierRepository)
        const result = await readClassifierStatusService.execute(id)
        console.timeEnd('benchmark');
        return result
    }

    public async classify({ body }: { body: ClassifyDto }) {
        console.time('benchmark');
        const classifierRepository = new MongoDBClassifierRepository()
        const storageProvider = new S3ProviderV2()
        const modelClassifierService = new ModelClassifierService(classifierRepository, storageProvider)
        const result = await modelClassifierService.execute(body)
        console.timeEnd('benchmark');
        return result
    }
}