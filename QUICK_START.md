# 🚀 QUICK START - Nigerian Tax Reform Acts RAG System

**Status:** ✅ Ready to use immediately!

---

## ⚡ 30-Second Quick Start

```bash
cd "/Users/mac/Desktop/Legal AId"
python3 cli_demo.py --use-faiss
```

Type any tax question and press Enter!

---

## 📝 Example Questions

Copy and paste these:

```
What is the commencement date?
```

```
Who replaces FIRS in the 2026 regime?
```

```
Are digital assets covered?
```

```
Do freelancers need to charge VAT?
```

```
What is the corporation tax rate?
```

```
Define taxable income for individuals
```

---

## 🎯 Single Query (No Interactive Mode)

```bash
python3 cli_demo.py "What is the VAT rate?" --use-faiss
```

---

## 📊 Verbose Mode (See Metadata)

```bash
python3 cli_demo.py "Your question?" --use-faiss --verbose
```

---

## 🔢 Get More Context (10 chunks instead of 5)

```bash
python3 cli_demo.py "Complex question?" --use-faiss --top-k 10
```

---

## 📁 Batch Processing

```bash
# Create questions file
cat > my_questions.txt << EOF
What is the commencement date?
Define taxable income
Are digital assets covered?
EOF

# Process all at once
python3 cli_demo.py --batch my_questions.txt --output answers.json --use-faiss
```

---

## 🔧 Python API Integration

```python
import sys
sys.path.append('/Users/mac/Desktop/Legal AId/src')

from retriever import TaxActRetriever
from generator import RAGPipeline

# Initialize once
retriever = TaxActRetriever(top_k=5, use_chromadb=False)
pipeline = RAGPipeline(retriever)

# Ask questions
result = pipeline.query("What is the VAT rate?")
print(result["answer"])
print(result["sources"])
```

---

## ⚠️ Important: Always Use `--use-faiss`

```bash
# ✅ CORRECT
python3 cli_demo.py "Question?" --use-faiss

# ❌ WRONG (will error)
python3 cli_demo.py "Question?"
```

---

## 📚 More Documentation

- **Full Guide:** `RAG_SYSTEM_README.md`
- **Success Report:** `SUCCESS_REPORT.md`
- **Pipeline Status:** `PIPELINE_STATUS.md`

---

## 🎉 You're All Set!

The system is ready to answer questions about:
- Tax rates and calculations
- Commencement dates
- Digital asset taxation
- VAT requirements
- FIRS/NRS transition
- Definitions and interpretations
- Exemptions and reliefs
- And much more!

**Just run:** `python3 cli_demo.py --use-faiss`
