This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Coding Challenge Feature

This application includes an integrated coding challenge feature that automatically detects when the AI interviewer presents coding problems and provides a full-featured code editor with real-time execution.

### Features

- **Automatic Detection**: Detects coding challenges when the AI sends messages containing `[START_CODING_CHALLENGE]` markers
- **Multi-language Support**: Supports Python, JavaScript, Java, C++, C, C#, Go, Rust, TypeScript, and more
- **Real-time Execution**: Uses Judge0 API for code execution and testing
- **Test Case Management**: Runs multiple test cases and shows detailed results
- **Performance Metrics**: Displays execution time and memory usage
- **Seamless Integration**: Submits results back to the interview flow

### Setup for Coding Challenges

1. Get a RapidAPI key for Judge0:
   - Visit [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
   - Subscribe to the free plan
   - Copy your API key

2. Add the API key to your environment variables:
   ```bash
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

### How It Works

1. When the AI interviewer sends a message containing a coding challenge (with `[START_CODING_CHALLENGE]` markers), the system automatically:
   - Parses the challenge JSON
   - Opens a full-screen coding interface
   - Provides language selection and code templates

2. Users can:
   - Write their solution in their preferred language
   - Run code with test cases
   - See real-time results and performance metrics
   - Submit their solution

3. Upon submission:
   - Results are sent to the backend
   - The interview continues with feedback
   - All test results are logged for evaluation

### Supported Languages

- Python 3
- JavaScript (Node.js)
- Java
- C++
- C
- C#
- Go
- Rust
- TypeScript
- And more via Judge0

# hirehack-frontend
