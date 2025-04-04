# CLI Saver

A modern web application for saving and managing your frequently used CLI commands. Built with Next.js 15, React, and Supabase.

## Features

- Save and organize your frequently used CLI commands
- Quick search functionality to find commands
- Dark/Light mode support
- Secure authentication with Supabase
- Responsive design for all devices

## Demo

Try it out at [https://cli-saver.vercel.app](https://cli-saver.vercel.app)

## Privacy Notice

Please be aware of the following privacy considerations when using CLI Saver:

- Commands stored in the database are visible to database administrators
- Avoid storing sensitive information such as:
  - Passwords
  - API keys
  - Access tokens
  - Private environment variables


## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend and authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/pasteq7/cli-saver
   cd cli-saver
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
