import { FaissStore } from "langchain/vectorstores/faiss"

class Service {
    #embeddings
    #vectorstore

    /** 
     * Genera un nuovo service per il salvataggio dei documenti
     * @param {*} embeddings oggetto base per il calcolo degli embeddings
     */
    constructor(embeddings) {
        this.#embeddings = embeddings
    }
    
    /** 
     * Inserisce una serie di documenti all'interno del DB
     * @param {[Document]} documents i documenti da salvare all'interno del DB
     * @return {Service}
     */
    async insert(documents) {
        this.#vectorstore = FaissStore.fromDocuments(documents, this.#embeddings)
        return this.#vectorstore
    }
}

export default Service