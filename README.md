# PremGPT: A ChatGPT Clone

## Introduction
PremGPT is an advanced ChatGPT clone designed to emulate the conversational abilities of OpenAI's GPT-4. The application is built using Flask and Next.js, leveraging the OpenAI API for AI interactions. PremGPT offers a unique user experience with features like multiple chat sessions, real-time AI interaction, and a dynamic learning model.

## Key Features
- **Multiple Chat Sessions**: Users can engage in multiple chat sessions simultaneously, with seamless browsing between them.
- **Real-Time Interaction**: Engineered for real-time interaction with the GPT-4 model, providing instant responses.
- **Dynamic AI Learning**: Incorporates LangChain for fine-tuning GPT-4, allowing the AI to learn and generate responses based on newly added information.
- **Robust UI**: Utilizes Next.js for server-side rendering and Tailwind CSS for a responsive user interface.
- **Reliable Data Handling**: Employs MySQL for efficient data management and storage.
- **AWS Hosting**: Hosted on AWS to ensure consistent and scalable performance.

## Technologies Used
- **Backend**: Flask, OpenAI API, LangChain, MySQL
- **Frontend**: Next.js, Tailwind CSS
- **Hosting**: AWS

## Installation and Setup
1. **Prerequisites**: Ensure you have Node.js, Python, and MySQL installed on your system.
2. **Cloning the Repository**:
3. **Setting Up the Backend**:
- Install Python dependencies:
  ```
  pip install langchain openai flask_cors pymysql
  ```
- Set up environment variables for OpenAI API and MySQL database.
- Start the backend server:
- ```
  cd backend
  python server.py
  ```

4. **Setting Up the Frontend**:
- Install Node.js dependencies:
  ```
  cd frontend
  npm install
  ```
- Start the frontend server:
  ```
  npm run dev
  ```


