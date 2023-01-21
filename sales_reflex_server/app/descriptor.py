from huggingface_hub import Repository
from keytotext import trainer


def download_model():
    model = trainer()

    token = "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"
    model_repo = Repository(
        "model",
        "ashrielbrian/t5-base-wikipedia-companies-keywords",
        token=token,
        git_user="ashrielbrian",
    )

    model.load_model(model_dir="model", use_gpu=True)
    return model


# output = model.predict(keywords=["band and roll", "german", "leather goods", "iphone", "ipad"], use_gpu=True)
# print(output)
