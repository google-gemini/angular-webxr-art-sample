# install gcloud  https://cloud.google.com/sdk/docs/install
gcloud init
gcloud config set project <PROJECT_ID>
gcloud auth application-default login
mkdir <work-folder>
cd <work-folder>
python3 -m venv .
. bin/activate
pip install -r requirements.txt
python main.py
