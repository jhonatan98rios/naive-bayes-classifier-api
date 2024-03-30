import Elysia from "elysia";
import { ClasssifierController } from "../../controllers";
import { readClassifierSchema, readClassifierStatusSchema } from "../middlewares/schema";

const classsifierController = new ClasssifierController()

export function router(app: Elysia) {
    return () => app
        .get("/list-classifiers", classsifierController.list)
        .get("/read-classifier/:id", classsifierController.readClassifier, readClassifierSchema)
        .get("/read-classifier/:id/status", classsifierController.readClassifierStatus, readClassifierStatusSchema)
}