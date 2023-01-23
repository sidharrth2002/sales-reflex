from keytotext import trainer
from huggingface_hub import Repository
import torch


def download_model():
    model = trainer()

    token = "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"
    model_repo = Repository(
        "model",
        "ashrielbrian/t5-base-wikipedia-companies-keywords",
        token=token,
        git_user="ashrielbrian"
    )

    use_gpu = False
    # check if gpu is available
    if torch.cuda.is_available():
        use_gpu = True

    model.load_model(model_dir="model", use_gpu=True)
    return model


# output = model.predict(keywords=["band and roll", "german", "leather goods", "iphone", "ipad"], use_gpu=True)
# print(output)
