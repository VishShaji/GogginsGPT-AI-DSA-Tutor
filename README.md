# 🚀 Goggins GPT - An AI-Based DSA Tutor 🚀

![UI](https://github.com/VishShaji/GogginsGPT-AI-DSA-Tutor/blob/main/assets/ui.png)

🎓 **Empowering DSA Learning with AI** 🎓  
This project delivers an AI-powered tutor specifically designed to teach **Data Structures and Algorithms (DSA)**. By leveraging state-of-the-art **LangChain** and **Hugging Face** technologies, this tutor provides students with personalized, interactive DSA learning experiences. Powered by **LLAMA 3.2**, it uses advanced **prompt engineering** to help learners master concepts efficiently.

### 💡 Why This AI Tutor Stands Out
- **Tailored DSA Learning**: The AI model is fine-tuned for DSA, designed to understand the complexity of the subject and adapt to the learner’s pace.
- **Interactive Chat UI**: Through a user-friendly chat interface, students can ask questions, get personalized help on coding problems, and receive explanations of DSA concepts.
- **Full-Stack Application**: Developed using **FastAPI** on the backend and **React** with **Node.js** for the frontend, ensuring a smooth user experience.
- **Containerized for Scalability**: With **Docker**, the application can be easily deployed and scaled, making it accessible to learners around the world.

### 🌟 Key Features
1. **Advanced AI Model (LLAMA 3.2)**:  
   The tutor uses **LLAMA-3.2**, a highly optimized model for understanding and teaching DSA concepts.
   
2. **Prompt Engineering**:  
   Implemented techniques to enhance the model’s teaching effectiveness, guiding students through DSA topics like searching, sorting, dynamic programming, and more.
   
3. **FastAPI Backend**:  
   The backend API was built using **FastAPI**, which ensures efficient performance and smooth communication between the model and the frontend.

4. **Interactive Frontend (React)**:  
   The frontend is built using **React** and **Node.js**, offering a chat-based interface for students to interact with the AI tutor.

5. **Containerization (Docker)**:  
   The entire application is containerized for seamless deployment, making it easy to run the application on any system or cloud service.

### 🛠️ Technologies Used
- **Backend**: Python, FastAPI, LangChain, Hugging Face, LLAMA, PyTorch, TensorFlow
- **Frontend**: React, Node.js
- **DevOps**: Docker, Git

### 🚧 Installation & Setup
Get the project running with a few easy steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ai-dsa-tutor.git
   cd ai-dsa-tutor
   ```

2. **Backend Setup**:
   Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   Move to the frontend folder and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Docker**:
   Ensure that Docker is installed, then run:
   ```bash
   docker-compose up --build
   ```

5. **Access the Application**:  
   Open your browser and navigate to `http://localhost:3000` to interact with the AI-based tutor.

### 📊 AI Model Performance & Key Metrics
- **Accuracy**: Fine-tuned for various levels of DSA questions, ensuring precise and clear answers for all difficulty levels.
- **Response Time**: Optimized for fast responses through efficient use of FastAPI and Docker.
  
<!-- Add space for performance visuals such as accuracy charts, response time benchmarks, etc. -->

### 🎯 Future Enhancements
1. **Additional Learning Modes**: Incorporate different levels of difficulty, coding challenges, and quiz modes to deepen the interactive learning experience.
2. **Expanded Curriculum**: Add support for more advanced algorithmic concepts and competitive programming topics.
3. **Real-time Code Evaluation**: Integrate a real-time code evaluator to allow students to write and test code within the app.
4. **Mobile-Friendly UI**: Enhance the frontend to be responsive for mobile and tablet users, expanding accessibility.

### 🤝 Contributing
We welcome contributions! If you have ideas for improving the AI tutor, feel free to open an issue or submit a pull request. Let's create the best DSA learning tool together!

### 📜 License
This project is licensed under the MIT License. Feel free to use, modify, and contribute to its development.

### 👏 Acknowledgments
Special thanks to:
- **LangChain** and **Hugging Face** for their amazing open-source tools and models.
- **FastAPI** for enabling the creation of a robust, high-performance backend.
- The open-source community for inspiring the development of educational AI tools.
