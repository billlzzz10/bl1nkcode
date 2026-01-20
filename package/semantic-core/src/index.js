import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import { pipeline } from '@xenova/transformers';
import chalk from 'chalk';
// Constants
const EMBEDDING_MODEL = 'nomic-ai/nomic-embed-text-v1.5';
const MILVUS_URL = 'localhost:19530';
const COLLECTION_NAME = 'phoenix_index';
// Singleton for embedding
class EmbeddingPipeline {
    static task = 'feature-extraction';
    static model = EMBEDDING_MODEL;
    static instance = null;
    static async getInstance() {
        if (this.instance === null) {
            console.log(chalk.blue('Initializing embedding model...'));
            // @ts-ignore
            this.instance = await pipeline(this.task, this.model);
            console.log(chalk.green('Embedding model loaded.'));
        }
        return this.instance;
    }
}
export async function indexContent(content) {
    const milvus = new MilvusClient(MILVUS_URL);
    try {
        const embedder = await EmbeddingPipeline.getInstance();
        console.log(`Connecting to Milvus at ${MILVUS_URL}...`);
        // Connect is usually automatic or via connect() depending on SDK version. 
        // 2.3.x usually connects on instantiation or first request.
        const hasCollection = await milvus.hasCollection({ collection_name: COLLECTION_NAME });
        if (!hasCollection.value) {
            console.log(chalk.yellow(`Collection '${COLLECTION_NAME}' not found. Creating...`));
            await milvus.createCollection({
                collection_name: COLLECTION_NAME,
                fields: [
                    { name: 'id', data_type: DataType.VarChar, max_length: 256, is_primary_key: true },
                    { name: 'vector', data_type: DataType.FloatVector, dim: 768 },
                    { name: 'text', data_type: DataType.VarChar, max_length: 65535 },
                    // JSON type support depends on Milvus server version. Fallback to VarChar if issue.
                    // Using VarChar for payload for broad compatibility if needed, but trying JSON.
                    { name: 'payload', data_type: DataType.JSON }
                ]
            });
            console.log('Creating index...');
            await milvus.createIndex({
                collection_name: COLLECTION_NAME,
                field_name: 'vector',
                index_type: 'IVF_FLAT',
                metric_type: 'COSINE',
                params: { nlist: 1024 }
            });
            // Load collection
            await milvus.loadCollectionSync({ collection_name: COLLECTION_NAME });
        }
        console.log(`Processing ${content.length} documents...`);
        const data = [];
        for (const doc of content) {
            // @ts-ignore
            const output = await embedder(doc.text, { pooling: 'mean', normalize: true });
            const vector = Array.from(output.data);
            data.push({
                id: doc.id,
                vector: vector,
                text: doc.text,
                payload: { source: 'manual-index' }
            });
        }
        if (data.length > 0) {
            console.log(`Inserting ${data.length} entities...`);
            await milvus.insert({
                collection_name: COLLECTION_NAME,
                data: data
            });
            console.log(chalk.green('Insert successful.'));
        }
    }
    catch (error) {
        console.error(chalk.red('Error during indexing:'));
        console.error(chalk.red(error.message || error));
        console.error(chalk.yellow('Ensure Milvus is running (localhost:19530).'));
    }
}
export async function searchContent(query, limit = 5) {
    const milvus = new MilvusClient(MILVUS_URL);
    try {
        const embedder = await EmbeddingPipeline.getInstance();
        // @ts-ignore
        const output = await embedder(query, { pooling: 'mean', normalize: true });
        const vector = Array.from(output.data);
        console.log(`Searching for: "${query}"...`);
        // load collection before search usually required
        await milvus.loadCollectionSync({ collection_name: COLLECTION_NAME });
        const results = await milvus.search({
            collection_name: COLLECTION_NAME,
            data: [vector],
            limit: limit,
            output_fields: ['text', 'payload', 'id']
        });
        return results.results;
    }
    catch (error) {
        console.error(chalk.red('Error during search:'), error.message || error);
        return [];
    }
}
