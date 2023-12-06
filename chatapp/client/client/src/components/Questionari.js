import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Questionari.css";
import { Link } from 'react-router-dom';

const Questionari = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/chat/questionAll"
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {questions.map((question, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => toggleAccordion(index)}
            >
              <span>{question.content}</span>
              <span className="togglecheck">
                {expandedIndex === index ? "▲" : "▼"}
              </span>
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">
                <p>Answer: {question.answer.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="container text-center mt-5">
      <Link to="/client" className="btn btn-primary">
        Go to ChatRoom
      </Link>
    </div>
    </div>
  );
};

export default Questionari;
