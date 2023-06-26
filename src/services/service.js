import { FaissStore } from "langchain/vectorstores/faiss"

class Service {
    #embeddings
    #vectorstore

    constructor(embeddings) {
        this.#embeddings = embeddings
    }

    get() {

    }

    async insert(documents) {
        this.#vectorstore = FaissStore.fromDocuments(documents, this.#embeddings)
        return this.#vectorstore
    }
}

export default Service