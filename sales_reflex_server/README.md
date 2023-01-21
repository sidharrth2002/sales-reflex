# sales-reflex-server

Sales Reflex Server

---

## Azure Search Cognitive Skills

For instructions on adding your API as a Custom Cognitive Skill in Azure Search see:
https://docs.microsoft.com/en-us/azure/search/cognitive-search-custom-skill-interface

## Resources

This project has two key dependencies:

| Dependency Name | Documentation                | Description                                                                            |
| --------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| spaCy           | https://spacy.io             | Industrial-strength Natural Language Processing (NLP) with Python and Cython           |
| FastAPI         | https://fastapi.tiangolo.com | FastAPI framework, high performance, easy to learn, fast to code, ready for production |

---

## Run Locally

To run locally in debug mode run:

```
cd sales_reflex_server
pip install -r requirements.txt
python3 -m spacy download en_core_web_sm
uvicorn main:app --reload
```
