# Meeting Notes Summarizer

Minimal full-stack app: paste/upload transcript, provide instruction/prompt, generate editable summary using OpenAI, send summary via email.

## Local run (backend)

1. cd backend
2. cp .env.example .env and fill the variables (OPENAI_API_KEY, SMTP_*).
3. npm install
4. npm run dev

## Local run (frontend)

1. cd frontend
2. npm install
3. Create `.env` if you need to set `REACT_APP_API_BASE` (defaults to http://localhost:4000)
4. npm start

## Deploy

- Backend: deploy to Render, Heroku, or any VPS. Make sure environment variables are set.
- Frontend: deploy to Vercel / Netlify / GitHub Pages (build step). Set the API base to the backend URL.

