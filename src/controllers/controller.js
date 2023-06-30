import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { OpenAIChat } from "langchain/llms/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import service from "../services/service.js"
import { BufferMemory } from "langchain/memory"
import { ConversationalRetrievalQAChain } from "langchain/chains"
import { PromptTemplate } from "langchain/prompts"

let vectorStore
let chain = null

class Controller {
    async upload(req, res) {
        const pdfBuffer = req.file.buffer

        const blob = new Blob([pdfBuffer], { type: 'application/pdf' })

        const loader = new PDFLoader(blob)
        const docs = await loader.load()

        const serv = new service(new OpenAIEmbeddings())
        vectorStore = await serv.insert(docs)

        res.redirect('/chat')
    }

    async interrogation(req, res) {
        const query = req.query.q
        
        let streamedResponse = "";
        const model = new OpenAIChat({ 
            temperature: 0,
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        console.log(token)
                    }
                }
            ]
        })
        
        if (!chain) {
            chain = ConversationalRetrievalQAChain.fromLLM(
                model,
                vectorStore.asRetriever(),
                {
                    memory: new BufferMemory({
                        memoryKey: "chat_history",
                    }),
                    qaChainOptions: {
                        type: "stuff",
                        prompt: PromptTemplate.fromTemplate("Dato un contesto composto da una serie di documenti e una domanda rispondi alla domanda basandoti esclusivamente sul contesto fornito, se non trovi la risposta rispondi 'scusa sembra che il testo non contenga la risposta'. \n\nCONTESTO:\n====\n{context}====\n\nDOMANDA: {question}\nRISPOSTA IN ITALIANO:"),
                    }
                },
            )
            
        }
        
        const question = query
        const result = await chain.call({ question })
        
        res.json(result)
    }
}

export default new Controller()