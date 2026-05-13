# Resume Matcher AI

An AI-powered resume analysis tool built with React, Vite, Supabase, and Gemini AI.
https://www.gethiroaiapp.tech/
# pitch deck : https://www.gethiroaiapp.tech/pitch
## Project Setup

### Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file (for local development) or your deployment platform (like Vercel).

#### Gemini AI
- `VITE_GEMINI_API_KEY`: Your Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

#### Supabase
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application expects the following tables in Supabase:

### `resumes`
- `id`: uuid (primary key)
- `resume_text`: text
- `created_at`: timestamp with time zone

### `job_descriptions`
- `id`: uuid (primary key)
- `description_text`: text
- `created_at`: timestamp with time zone

### `analyses`
- `id`: uuid (primary key)
- `resume_id`: uuid (foreign key to resumes.id)
- `jd_id`: uuid (foreign key to job_descriptions.id)
- `match_score`: integer
- `analysis_summary`: text
- `missing_keywords`: jsonb (array of strings)
- `interview_questions`: jsonb (array of strings)
- `created_at`: timestamp with time zone

## Deployment on Vercel

1. Connect your GitHub repository to Vercel.
2. Add the environment variables listed above in the Vercel project settings.
3. Deploy!
