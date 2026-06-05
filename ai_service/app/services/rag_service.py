import json
import os
import numpy as np
import google.generativeai as genai
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "mock_medical_guidelines.json"

class LightweightRAG:
    def __init__(self):
        self.documents = []
        self.embeddings = []
        self.is_initialized = False

    def initialize(self, api_key: str):
        if self.is_initialized:
            return
        
        genai.configure(api_key=api_key)
        
        try:
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for item in data:
                text = f"Tiêu đề: {item['title']}\nNội dung: {item['content']}"
                self.documents.append(text)
                
                result = genai.embed_content(
                    model="models/gemini-embedding-2",
                    content=text,
                    task_type="retrieval_document"
                )
                self.embeddings.append(result['embedding'])
                
            self.embeddings = np.array(self.embeddings)
            self.is_initialized = True
        except Exception as e:
            pass

    def cosine_similarity(self, v1, v2):
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        return dot_product / (norm_v1 * norm_v2)

    def retrieve_context(self, query: str, top_k: int = 2) -> str:
        if not self.is_initialized or len(self.documents) == 0:
            return ""

        try:
            query_embed = genai.embed_content(
                model="models/gemini-embedding-2",
                content=query,
                task_type="retrieval_query"
            )['embedding']
            
            similarities = []
            for doc_embed in self.embeddings:
                sim = self.cosine_similarity(query_embed, doc_embed)
                similarities.append(sim)
                
            top_indices = np.argsort(similarities)[-top_k:][::-1]
            
            retrieved_docs = []
            for idx in top_indices:
                if similarities[idx] > 0.6:
                    retrieved_docs.append(self.documents[idx])
                    
            if retrieved_docs:
                return "\n---\n".join(retrieved_docs)
            return ""
        except Exception as e:
            return ""

rag_system = LightweightRAG()
