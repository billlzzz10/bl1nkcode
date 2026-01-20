export declare function indexContent(content: {
    id: string;
    text: string;
}[]): Promise<void>;
export declare function searchContent(query: string, limit?: number): Promise<import("@zilliz/milvus2-sdk-node").SearchResultData[]>;
