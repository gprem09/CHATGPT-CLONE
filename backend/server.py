from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from langchain.chains import ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import DirectoryLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.indexes import VectorstoreIndexCreator
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.vectorstores import Chroma

openai_api_key = os.getenv('OPENAI_API_KEY')

if not openai_api_key:
    raise ValueError("OpenAI API key is not set.")

os.environ["OPENAI_API_KEY"] = openai_api_key

app = Flask(__name__)
CORS(app)

PERSIST = False
PERSIST_DIRECTORY = "persist"
DATA_DIRECTORY = "data/"

def load_or_create_index():
    if PERSIST and os.path.exists(PERSIST_DIRECTORY):
        vectorstore = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=OpenAIEmbeddings())
        return VectorStoreIndexWrapper(vectorstore=vectorstore)
    else:
        loader = DirectoryLoader(DATA_DIRECTORY)
        creator = VectorstoreIndexCreator(
            vectorstore_kwargs={"persist_directory": PERSIST_DIRECTORY}) if PERSIST else VectorstoreIndexCreator()
        return creator.from_loaders([loader])

index = load_or_create_index()

chain = ConversationalRetrievalChain.from_llm(
    llm=ChatOpenAI(model="gpt-3.5-turbo"),
    retriever=index.vectorstore.as_retriever(search_kwargs={"k": 1}),
)

chat_history_global = []

@app.route("/api/chat", methods=['POST'])
def chat():
    global chat_history_global
    input_text = request.json.get('input')
    if not input_text:
        return jsonify({'error': 'No input provided'}), 400

    result = chain({"question": input_text, "chat_history": chat_history_global})
    chat_history_global.append((input_text, result['answer']))

    return jsonify({'response': result['answer']})

if __name__ == "__main__":
    app.run(debug=True, port=8080)
