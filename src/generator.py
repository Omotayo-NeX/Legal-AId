"""
Answer Generator for Nigerian Tax Reform Acts RAG system.
Generates responses using retrieved context and GPT models.
"""

import os
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    from openai import OpenAI
except ImportError:
    raise ImportError("Missing openai library. Run: pip install openai")

from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env.backend")

class AnswerGenerator:
    """Generates answers using RAG context and GPT models."""

    def __init__(self, model: str = None):
        """
        Initialize generator.

        Args:
            model: OpenAI chat model to use
        """
        self.model = model or os.getenv("CHAT_MODEL", "gpt-4o-mini")

        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set in environment")
        self.client = OpenAI(api_key=api_key)

    def build_system_prompt(self) -> str:
        """
        Build system prompt for the model.

        Returns:
            System prompt string
        """
        return """You are a specialized legal assistant for Nigerian tax law, with expertise in the Nigerian Tax Reform Acts of 2025-2026.

Your role is to:
1. Provide accurate, detailed answers based on the provided context from the official Acts
2. Give confident, clear, and practical guidance
3. Explain complex tax provisions in accessible language
4. Highlight important dates, rates, amounts, and requirements
5. Note any uncertainties, exceptions, or conditional provisions
6. Use a helpful, professional tone suitable for a legal/compliance product

Important guidelines:
- Write in a confident, expert tone - avoid phrases like "based on the provided context" or apologetic language
- Give direct answers first, then provide supporting details
- Structure responses with headers, bullets, and short paragraphs for readability
- If the query is out-of-scope or information is not available, clearly state it without being defensive
- Use Lagos time zone (Africa/Lagos) for any timestamps
- If there are conflicting provisions or exceptions, clearly explain them

Response format:
- Start with a clear, direct answer
- Use structured formatting (headers, bullets, numbered lists)
- Provide practical "Next Steps" or "What You Must Do" summaries when relevant
- Do NOT include a separate "Sources" section at the end
- Keep the tone professional and authoritative
"""

    def build_user_prompt(self, query: str, context: str) -> str:
        """
        Build user prompt with query and context.

        Args:
            query: User's question
            context: Retrieved context from documents

        Returns:
            User prompt string
        """
        return f"""Question: {query}

Context from Nigerian Tax Reform Acts 2025-2026:
{context}

Provide a comprehensive answer that:
1. Starts with a clear, direct answer
2. Uses structured formatting (headers, bullets, numbered lists)
3. Explains technical terms in accessible language
4. Notes important conditions, exceptions, or requirements
5. Ends with practical "Next Steps" or "What You Must Do" when relevant
6. Does NOT include a "Sources" section
7. Writes in a confident, professional tone

If information is not available, state it clearly without being apologetic or defensive."""

    def generate(
        self,
        query: str,
        context: str,
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """
        Generate answer using GPT model.

        Args:
            query: User's question
            context: Retrieved context
            temperature: Model temperature (lower = more focused)
            max_tokens: Maximum tokens in response

        Returns:
            Dictionary with answer and metadata
        """
        system_prompt = self.build_system_prompt()
        user_prompt = self.build_user_prompt(query, context)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )

            answer = response.choices[0].message.content
            finish_reason = response.choices[0].finish_reason

            return {
                "answer": answer,
                "model": self.model,
                "finish_reason": finish_reason,
                "tokens_used": {
                    "prompt": response.usage.prompt_tokens,
                    "completion": response.usage.completion_tokens,
                    "total": response.usage.total_tokens
                }
            }

        except Exception as e:
            return {
                "answer": f"Error generating answer: {str(e)}",
                "model": self.model,
                "finish_reason": "error",
                "tokens_used": None,
                "error": str(e)
            }

    def generate_with_sources(
        self,
        query: str,
        context: str,
        sources: List[Dict[str, str]],
        temperature: float = 0.1,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """
        Generate answer and format with sources.

        Args:
            query: User's question
            context: Retrieved context
            sources: List of source dictionaries
            temperature: Model temperature
            max_tokens: Maximum tokens

        Returns:
            Dictionary with answer, formatted sources, and metadata
        """
        # Generate answer
        result = self.generate(query, context, temperature, max_tokens)

        # Format sources
        formatted_sources = self._format_sources(sources)
        result["sources"] = formatted_sources
        result["source_list"] = sources

        return result

    def _format_sources(self, sources: List[Dict[str, str]]) -> str:
        """
        Format sources into readable citation list.

        Args:
            sources: List of source dictionaries

        Returns:
            Formatted sources string
        """
        if not sources:
            return "No sources available."

        formatted = ["Sources:"]
        for i, source in enumerate(sources, 1):
            parts = []

            if source.get("document"):
                parts.append(source["document"])

            if source.get("section"):
                parts.append(f"Section {source['section']}")

            if source.get("title"):
                parts.append(f"- {source['title']}")

            if source.get("pages"):
                parts.append(f"(Pages {source['pages']})")

            formatted.append(f"{i}. {' '.join(parts)}")

        return "\n".join(formatted)

class RAGPipeline:
    """Complete RAG pipeline combining retrieval and generation."""

    def __init__(
        self,
        retriever,
        generator: Optional[AnswerGenerator] = None
    ):
        """
        Initialize RAG pipeline.

        Args:
            retriever: TaxActRetriever instance
            generator: AnswerGenerator instance (optional)
        """
        self.retriever = retriever
        self.generator = generator or AnswerGenerator()

    def query(
        self,
        question: str,
        filters: Optional[Dict[str, Any]] = None,
        top_k: Optional[int] = None,
        temperature: float = 0.1
    ) -> Dict[str, Any]:
        """
        Execute complete RAG query.

        Args:
            question: User's question
            filters: Optional metadata filters
            top_k: Number of chunks to retrieve (overrides default)
            temperature: Model temperature

        Returns:
            Dictionary with answer, context, sources, and metadata
        """
        # Override top_k if specified
        original_top_k = None
        if top_k:
            original_top_k = self.retriever.top_k
            self.retriever.top_k = top_k

        # Retrieve relevant chunks
        results = self.retriever.retrieve(question, filters)

        # Restore original top_k
        if original_top_k:
            self.retriever.top_k = original_top_k

        # Format context
        context = self.retriever.format_context(results)

        # Get sources
        sources = self.retriever.get_sources(results)

        # Generate answer
        response = self.generator.generate_with_sources(
            question,
            context,
            sources,
            temperature
        )

        # Add retrieval info
        response["retrieved_chunks"] = len(results)
        response["query"] = question

        return response
