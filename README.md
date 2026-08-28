# PramaanSetu

An independent hackathon prototype for a clearer certificate-request journey. It uses only mock data, has no login or backend, and never submits information to a government system.

## Run locally

```powershell
Copy-Item .env.example .env
# Add your HF_TOKEN to .env
py -m pip install -r requirements.txt
py -m uvicorn server:app --reload --port 8000
```

In a second terminal:

```powershell
npm install
npm run dev
```

Open the localhost address Vite displays. The browser sends each selected image to the local Python API, which calls `InferenceClient(provider="auto", api_key=os.environ["HF_TOKEN"])` with `umm-maybe/AI-image-detector`. The token remains server-side. The model reports AI-generation risk, not proof that a document is genuine.
