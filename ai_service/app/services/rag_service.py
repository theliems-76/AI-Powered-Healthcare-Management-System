import json
import os
import numpy as np
import google.generativeai as genai
from pathlib import Path

DOCS_PATH = Path(__file__).resolve().parents[1] / "data" / "documents.json"
EMBEDS_PATH = Path(__file__).resolve().parents[1] / "data" / "embeddings.npy"

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
            # Ensure data directory exists
            os.makedirs(DOCS_PATH.parent, exist_ok=True)
            
            # Load documents and embeddings if they exist
            if DOCS_PATH.exists() and EMBEDS_PATH.exists():
                with open(DOCS_PATH, 'r', encoding='utf-8') as f:
                    self.documents = json.load(f)
                self.embeddings = np.load(EMBEDS_PATH)
            else:
                self.documents = []
                self.embeddings = np.empty((0, 768)) # Gemini embedding size
                
            self.is_initialized = True
        except Exception as e:
            print(f"Lỗi khởi tạo RAG: {e}")
            self.documents = []
            self.embeddings = np.empty((0, 768))

    def _save_data(self):
        with open(DOCS_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.documents, f, ensure_ascii=False, indent=2)
        np.save(EMBEDS_PATH, self.embeddings)

    def extract_text(self, file_path: str) -> str:
        if file_path.endswith('.pdf'):
            import PyPDF2
            text = ""
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            return text
        elif file_path.endswith('.txt'):
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        return ""

    def add_document(self, file_path: str, filename: str) -> int:
        text = self.extract_text(file_path)
        if not text.strip():
            return 0
            
        # Chia nhỏ đoạn văn (Chunking) mỗi chunk khoảng 500-1000 ký tự
        chunks = []
        paragraphs = text.split('\n\n')
        current_chunk = ""
        for p in paragraphs:
            if len(current_chunk) + len(p) > 1000:
                chunks.append(current_chunk)
                current_chunk = p
            else:
                current_chunk += "\n" + p
        if current_chunk:
            chunks.append(current_chunk)
            
        # Nhúng (Embed) từng chunk
        added_count = 0
        for chunk in chunks:
            chunk = chunk.strip()
            if len(chunk) < 50: # Bỏ qua chunk quá ngắn
                continue
                
            formatted_text = f"[Nguồn: {filename}]\n{chunk}"
            
            try:
                result = genai.embed_content(
                    model="models/gemini-embedding-2",
                    content=formatted_text,
                    task_type="retrieval_document"
                )
                self.documents.append(formatted_text)
                new_embed = np.array([result['embedding']])
                if len(self.embeddings) == 0:
                    self.embeddings = new_embed
                else:
                    self.embeddings = np.vstack([self.embeddings, new_embed])
                added_count += 1
            except Exception as e:
                print(f"Lỗi khi embed chunk: {e}")
                
        if added_count > 0:
            self._save_data()
            
        return added_count

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
