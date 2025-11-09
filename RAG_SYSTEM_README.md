# Nigerian Tax Reform Acts 2025-2026 - RAG System

A production-grade Retrieval-Augmented Generation (RAG) system for the Nigerian Tax Reform Acts 2025-2026. This system provides accurate, citation-backed answers to questions about Nigerian tax legislation using semantic search and GPT-powered generation.

## Features

- **Official Source Integration**: Automatically fetches and parses official PDF documents from the National Assembly
- **Semantic Chunking**: Intelligent document chunking with context preservation and deduplication
- **Vector Search**: Fast similarity search using FAISS and ChromaDB
- **Citation-Backed Answers**: Every answer includes specific section references and page numbers
- **Quality Gates**: Built-in validation, duplicate detection, and uncertainty flagging
- **Multi-Modal Search**: Support for definitions, rates, dates, and monetary amounts
- **Comprehensive Testing**: Automated test suite for retrieval quality validation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Query                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Query Embedding (OpenAI)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Vector Search (FAISS / ChromaDB)                     │
│         - Retrieve top-k relevant chunks                     │
│         - Filter by metadata (optional)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Context Formatting                              │
│         - Add section references                             │
│         - Include page numbers                               │
│         - Preserve document structure                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Answer Generation (GPT-4)                            │
│         - Use retrieved context                              │
│         - Cite specific sections                             │
│         - Flag uncertainties                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Formatted Response                              │
│         - Answer text                                        │
│         - Source citations                                   │
│         - Metadata                                           │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
Legal AId/
├── .env.backend              # Environment variables (create from template)
├── requirements.txt          # Python dependencies
├── RAG_SYSTEM_README.md      # This file
│
├── scripts/                  # Pipeline scripts
│   ├── 01_fetch_sources.py   # Download official PDFs
│   ├── 02_parse_pdf.py       # Parse PDFs with PyMuPDF
│   ├── 03_make_chunks.py     # Create semantic chunks
│   └── 04_embed_and_index.py # Generate embeddings and build indices
│
├── src/                      # Core modules
│   ├── retriever.py          # Vector search and retrieval
│   └── generator.py          # Answer generation and RAG pipeline
│
├── data/                     # Data directory
│   ├── raw/                  # Raw PDF files
│   ├── processed/            # Parsed JSON and chunks
│   └── embeddings/           # Vector indices and embeddings
│
├── tests/                    # Test suite
│   └── test_retrieval.py     # Retrieval quality tests
│
└── cli_demo.py              # Command-line interface
```

## Installation & Setup

### Prerequisites

- Python 3.8 or higher
- OpenAI API key
- 2GB+ free disk space
- Internet connection (for downloading PDFs)

### Step 1: Create Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

```bash
# Create environment file
cat > .env.backend << EOF
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Configuration
EMBEDDING_MODEL=text-embedding-3-small
CHAT_MODEL=gpt-4-turbo-preview
CHUNK_SIZE=800
CHUNK_OVERLAP=200
TOP_K_RESULTS=5
EOF

# Edit and add your API keys
nano .env.backend  # or use your preferred editor
```

### Step 4: Run the Pipeline

Execute the scripts in order:

```bash
# 1. Fetch official PDF sources
python scripts/01_fetch_sources.py

# 2. Parse PDFs and extract structure
python scripts/02_parse_pdf.py

# 3. Create semantic chunks
python scripts/03_make_chunks.py

# 4. Generate embeddings and build indices
python scripts/04_embed_and_index.py
```

Each script provides detailed progress information and saves its output for the next stage.

## Usage

### Interactive Mode

Start an interactive session:

```bash
python cli_demo.py
```

Type your questions and get instant answers:

```
🔍 Question: What is the commencement date?
```

### Single Query Mode

Ask a single question:

```bash
python cli_demo.py "Do freelancers need to charge VAT under 2026 Nigerian tax law?"
```

Add `--verbose` for detailed metadata:

```bash
python cli_demo.py "What is the VAT rate?" --verbose
```

### Batch Processing Mode

Process multiple queries from a file:

```bash
# Create a file with questions (one per line)
echo "What is the commencement date?" > queries.txt
echo "Define taxable income for companies." >> queries.txt

# Process all queries
python cli_demo.py --batch queries.txt --output results.json
```

### Advanced Options

```bash
# Retrieve more chunks for better context
python cli_demo.py "Complex question?" --top-k 10

# Use FAISS instead of ChromaDB
python cli_demo.py "Question?" --use-faiss

# Adjust generation temperature (0.0-1.0)
python cli_demo.py "Question?" --temperature 0.3
```

## Testing

Run the test suite to validate retrieval quality:

```bash
python tests/test_retrieval.py
```

The test suite evaluates:
- Commencement date retrieval
- Definition extraction (companies vs individuals)
- Digital asset coverage
- Institutional changes (FIRS replacement)
- Dividend treatment rules
- VAT rates and requirements
- Practical application questions

Test results are saved to `tests/test_results.json`.

### Test Output

Each test shows:
- Retrieved chunks with metadata
- Generated answer with citations
- Keyword match analysis
- Token usage statistics

## Pipeline Details

### 1. Source Fetching (`01_fetch_sources.py`)

Downloads official PDFs from:
- National Assembly website (nass.gov.ng)
- Federal Inland Revenue Service
- Other official government sources

**Output**: `data/raw/*.pdf` and `sources_metadata.json`

**Features**:
- Automatic retry on failure
- Content-type validation
- Progress indicators
- Metadata tracking

### 2. PDF Parsing (`02_parse_pdf.py`)

Extracts structured data from PDFs using PyMuPDF:
- Table of contents
- Sections, parts, chapters, and schedules
- Definitions and key terms
- Page-level text and layout

**Output**: `data/processed/*_parsed.json`

**Features**:
- Hierarchical structure preservation
- Definition extraction
- Section identification with regex patterns
- Bounding box preservation

### 3. Semantic Chunking (`03_make_chunks.py`)

Creates semantically meaningful chunks:
- Sentence-level splitting
- Context overlap between chunks
- Metadata enrichment
- Duplicate detection

**Output**: `data/processed/chunks.jsonl`

**Quality Gates**:
- JSONL validation (no broken lines)
- Section number/title verification
- Hash-based deduplication
- Uncertainty detection

**Metadata per Chunk**:
- Document name and type
- Section number and title
- Page range
- Contains: definitions, rates, dates, amounts
- Uncertainty notes

### 4. Embedding & Indexing (`04_embed_and_index.py`)

Creates vector embeddings and search indices:
- OpenAI text-embedding-3-small (1536 dimensions)
- FAISS L2 index for similarity search
- ChromaDB collection for metadata filtering
- Persistent storage

**Output**:
- `data/embeddings/faiss_index.bin`
- `data/embeddings/embeddings.npy`
- `data/embeddings/chromadb/`
- `data/embeddings/chunk_metadata.json`

**Features**:
- Batch processing for efficiency
- Progress tracking
- Dual indexing (FAISS + ChromaDB)
- Metadata preservation

## Retrieval System

### Retriever (`src/retriever.py`)

**Features**:
- Dual backend support (FAISS / ChromaDB)
- Query embedding with OpenAI
- Top-k similarity search
- Metadata filtering (ChromaDB only)
- Source citation extraction

**Usage**:
```python
from retriever import TaxActRetriever

retriever = TaxActRetriever(top_k=5, use_chromadb=True)
results = retriever.retrieve("What is the VAT rate?")
```

### Generator (`src/generator.py`)

**Features**:
- GPT-4 Turbo for answer generation
- Citation-backed responses
- Uncertainty flagging
- Source formatting
- Token usage tracking

**System Prompt Guidelines**:
- Only cite retrieved chunks
- State when information is not found
- Prefer Act text over summaries
- Use Lagos timezone (Africa/Lagos)
- Explain exceptions and conditions

**Usage**:
```python
from generator import RAGPipeline
from retriever import TaxActRetriever

retriever = TaxActRetriever()
pipeline = RAGPipeline(retriever)
result = pipeline.query("What is the commencement date?")
```

## Configuration

Edit `.env.backend` to customize:

```bash
# Embedding model
EMBEDDING_MODEL=text-embedding-3-small

# Chat model for generation
CHAT_MODEL=gpt-4-turbo-preview

# Chunking parameters
CHUNK_SIZE=800
CHUNK_OVERLAP=200

# Retrieval parameters
TOP_K_RESULTS=5
```

## Quality Assurance

### Validation Checks

1. **JSONL Validation**: Ensures no broken lines, proper JSON formatting
2. **Section Verification**: Matches section numbers/titles with PDF TOC
3. **Deduplication**: Removes near-duplicate chunks using text hashing
4. **Uncertainty Detection**: Flags conflicting information, multiple rates, amendments

### Uncertainty Notes

The system automatically adds notes for:
- Conditional or uncertain language
- Multiple rates mentioned in same chunk
- Amendments or changes to existing law
- Exceptions and special conditions

### Citation Requirements

- Only cite chunks returned by retriever
- Include section number and page range
- Specify document name
- Note uncertainty when present

## Cost Estimation

**Embedding Costs** (text-embedding-3-small):
- ~$0.002 per 1,000 chunks
- Typical document: 500-2,000 chunks

**Query Costs** (gpt-4-turbo-preview):
- ~$0.01-0.03 per query
- Depends on context size and answer length

**Storage**:
- PDFs: 10-50 MB
- Embeddings: 50-200 MB
- Indices: 10-100 MB

## Troubleshooting

### PDFs Not Downloading

- Check internet connection
- Verify URLs in `scripts/01_fetch_sources.py`
- Try running with `--debug` flag

### Parsing Errors

- Ensure PDFs are not corrupted
- Check PyMuPDF installation: `pip install --upgrade pymupdf`

### Embedding Errors

- Verify OpenAI API key is set
- Check API quota and billing
- Reduce batch size if hitting rate limits

### No Results for Query

- Verify indices were built successfully
- Check if chunks exist: `cat data/processed/chunks.jsonl | wc -l`
- Try broader or more specific queries

### Import Errors

```bash
pip install --upgrade -r requirements.txt
```

## Advanced Features

### Custom Filters (ChromaDB Only)

```python
# Filter by document
results = retriever.retrieve(
    "VAT rates",
    filters={"document_name": "nigeria_tax_bill_2024.pdf"}
)

# Filter by section type
results = retriever.retrieve(
    "definitions",
    filters={"contains_definition": True}
)
```

### Adjust Retrieval Parameters

```python
# Get more context
retriever.top_k = 10

# Use FAISS for speed
retriever = TaxActRetriever(use_chromadb=False)
```

### Custom Generation Parameters

```python
result = pipeline.query(
    "complex question",
    top_k=8,
    temperature=0.2
)
```

## API Integration

To integrate into your application:

```python
from src.retriever import TaxActRetriever
from src.generator import RAGPipeline

# Initialize once (cache this)
retriever = TaxActRetriever(top_k=5)
pipeline = RAGPipeline(retriever)

# Use for queries
def answer_tax_question(question: str) -> dict:
    result = pipeline.query(question)
    return {
        "answer": result["answer"],
        "sources": result["sources"],
        "confidence": result.get("keyword_score", 0.0)
    }
```

## Future Enhancements

- [ ] Multi-language support (Yoruba, Hausa, Igbo)
- [ ] Web interface with Streamlit
- [ ] API server with FastAPI
- [ ] Hybrid search (BM25 + vector)
- [ ] Fine-tuned embedding models
- [ ] Real-time PDF updates
- [ ] Enhanced deduplication with fuzzy matching
- [ ] Query expansion and reranking

## License

This project uses official Nigerian government documents which are in the public domain.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review test results: `python tests/test_retrieval.py`
3. Enable debug mode: `export DEBUG=1`

## Credits

- Nigerian National Assembly for official documents
- OpenAI for embedding and generation models
- PyMuPDF for PDF parsing
- FAISS for vector search
- ChromaDB for metadata filtering

## Disclaimer

This system provides information based on the Nigerian Tax Reform Acts 2025-2026. Always consult with qualified tax professionals for specific legal advice. The system aims for accuracy but may not capture all nuances of tax legislation.

---

**Built with ⚖️ for Nigerian legal clarity**
