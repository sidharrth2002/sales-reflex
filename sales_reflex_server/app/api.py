# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

from collections import defaultdict
import os

from fastapi import Body, FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
import spacy
import srsly
import uvicorn
from textblob import TextBlob

from app.models import (
    ENT_PROP_MAP,
    RecordsRequest,
    RecordsResponse,
    RecordsEntitiesByTypeResponse,
    SentimentRequest,
    CompanyDescriptionRequest,
    CompanyDescriptionResponse,
)
from app.descriptor import download_model
from app.spacy_extractor import SpacyExtractor
from wordwise import Extractor

from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("gpt2")

model = AutoModelForCausalLM.from_pretrained("gpt2")

app = FastAPI(
    title="sales-reflex-server",
    version="1.0",
    description="Sales Reflex Server",
)

# allow all origins for now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
)

example_request = srsly.read_json("app/data/example_request.json")

nlp = spacy.load("en_core_web_sm")
extractor = SpacyExtractor(nlp)

company_description_model = download_model()


@app.get("/", include_in_schema=False)
def docs_redirect():
    return RedirectResponse(f"/docs")


@app.post("/sentiment", tags=["Sentiment"])
async def sentiment(body: SentimentRequest):
    return {"sentiment": TextBlob(body.text).sentiment.polarity}


@app.post("/gpt2", tags=["GPT2"])
async def gpt2(body: SentimentRequest, num_words: int = 30):
    # generate 200 words from the given text
    return tokenizer.decode(
        model.generate(
            tokenizer.encode(body.text, return_tensors="pt"), max_length=num_words
        )[0]
    )


@app.post("/extraction", tags=["Wordwise"])
async def extraction(body: SentimentRequest):
    return {"extraction": Extractor().generate(body.text)}


@app.post("/entities", response_model=RecordsResponse, tags=["NER"])
async def extract_entities(body: RecordsRequest = Body(..., example=example_request)):
    """Extract Named Entities from a batch of Records."""

    res = []
    documents = []

    for val in body.values:
        documents.append({"id": val.recordId, "text": val.data.text})

    entities_res = extractor.extract_entities(documents)

    res = [
        {"recordId": er["id"], "data": {"entities": er["entities"]}}
        for er in entities_res
    ]

    return {"values": res}


@app.post(
    "/entities_by_type", response_model=RecordsEntitiesByTypeResponse, tags=["NER"]
)
async def extract_entities_by_type(
    body: RecordsRequest = Body(..., example=example_request)
):
    """Extract Named Entities from a batch of Records separated by entity label.
    This route can be used directly as a Cognitive Skill in Azure Search
    For Documentation on integration with Azure Search, see here:
    https://docs.microsoft.com/en-us/azure/search/cognitive-search-custom-skill-interface"""

    res = []
    documents = []

    for val in body.values:
        documents.append({"id": val.recordId, "text": val.data.text})

    entities_res = extractor.extract_entities(documents)
    res = []

    for er in entities_res:
        groupby = defaultdict(list)
        for ent in er["entities"]:
            ent_prop = ENT_PROP_MAP[ent["label"]]
            groupby[ent_prop].append(ent["name"])
        record = {"recordId": er["id"], "data": groupby}
        res.append(record)

    return {"values": res}


@app.post("/descriptions", response_model=CompanyDescriptionResponse)
async def get_company_descriptions_from_keywords(body: CompanyDescriptionRequest):
    description = company_description_model.predict(
        keywords=body.keywords, use_gpu=False
    )
    print(description)
    return {"description": description}
