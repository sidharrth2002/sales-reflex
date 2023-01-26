import torch
from huggingface_hub import Repository
from keytotext import trainer

sid_token = "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"
brian_token = "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"


def download_model():
    model = trainer()

    model_repo = Repository(
        "model",
        "ashrielbrian/t5-base-wikipedia-companies-keywords",
        token=sid_token,
        git_user="ashrielbrian",
    )

    use_gpu = False
    # check if gpu is available
    if torch.cuda.is_available():
        use_gpu = True

    model.load_model(model_dir="model", use_gpu=False)
    return model


# output = model.predict(keywords=["band and roll", "german", "leather goods", "iphone", "ipad"], use_gpu=True)
# print(output)
