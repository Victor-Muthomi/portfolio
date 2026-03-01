---
title: "Integrating AI into Real-World Applications: Lessons Learned"
date: 2026-01-20
author: "Victor Muthomi"
tags: ["AI", "NLP", "Python", "Rasa"]
category: "Machine Learning"
excerpt: "Practical lessons from building an AI virtual assistant with Rasa NLP — from intent design and entity extraction to deploying a production-ready conversational agent."
---

## The Problem We Were Solving

University websites are notoriously difficult to navigate. Prospective students, staff, and visitors all need different information — and the search bar rarely cuts it. The goal was to build a voice-enabled AI assistant that could answer common queries conversationally, reducing support requests and improving user satisfaction.

## Choosing Rasa

After evaluating Dialogflow, Wit.ai, and raw transformer-based pipelines, we chose **Rasa Open Source** for three reasons:

- Fully self-hosted — no third-party data sharing.
- Custom pipeline components for domain-specific NLU.
- Python-native, making integration with our FastAPI backend straightforward.

## Designing Intents and Entities

The quality of your training data is the single biggest lever you can pull. We spent more time on intent design than on any other part of the project, and it paid off.

> "Your model is only as good as your intent taxonomy."

A few rules we settled on:

- **Keep intents atomic.** `ask_admission_requirements` beats `ask_general_info`. Broad intents cause misclassification at the edges.
- **At least 15 training examples per intent.** Vary phrasing, sentence length, and formality (including typos).
- **Use synonyms for entities.** Map "BSc", "Bachelor of Science", and "undergraduate degree" to the same canonical value.

## Building the NLU Pipeline

Our `config.yml` pipeline combined a pre-trained language model with Rasa's featurizers for best accuracy on domain-specific language:

```yaml
pipeline:
  - name: SpacyNLP
    model: en_core_web_md
  - name: SpacyTokenizer
  - name: SpacyFeaturizer
  - name: RegexFeaturizer
  - name: LexicalSyntacticFeaturizer
  - name: CountVectorsFeaturizer
  - name: DIETClassifier
    epochs: 100
  - name: EntitySynonymMapper
  - name: ResponseSelector
    epochs: 80
```

The **DIETClassifier** (Dual Intent and Entity Transformer) gave us the best balance between training speed and accuracy on our 800-example dataset.

## Google Text-to-Speech Integration

Once Rasa returned a text response, we piped it through the **Google Cloud TTS API** to synthesise audio. The key insight was to cache synthesised audio for common responses — the top 50 answers covered around 70% of queries, eliminating most API latency.

```python
from google.cloud import texttospeech
import functools

@functools.lru_cache(maxsize=256)
def synthesise(text: str) -> bytes:
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )
    return response.audio_content
```

## Fallback and Confidence Thresholds

No model is perfect. Configure a **FallbackClassifier** in Rasa so that low-confidence predictions trigger a graceful "I'm not sure, try phrasing it differently" response instead of a wrong answer. We set the threshold at `0.65` after analysing the confidence distribution on our validation set.

## Key Takeaways

- Invest heavily in data collection and cleaning — it outweighs model tuning.
- Self-hosted NLP is viable and gives you full control over your data pipeline.
- Cache TTS outputs aggressively; latency kills conversational UX.
- Instrument every conversation and retrain monthly with real user queries.
- Define clear fallback behaviour before launch — edge cases will surprise you.

## What's Next

The next iteration will explore fine-tuning a small **LLM** (e.g. Mistral 7B via Ollama) on the university's knowledge base, replacing the static intent classifier with a retrieval-augmented generation (RAG) pipeline for more flexible, factual responses.
