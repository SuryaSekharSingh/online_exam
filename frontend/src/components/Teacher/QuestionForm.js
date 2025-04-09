import React, { useState } from 'react';

const QuestionForm = ({ onAddQuestion }) => {
  const [form, setForm] = useState({
    title: '',
    answer: '',
    type: 'one-word'
  });

  const marksMap = {
    'one-word': 1,
    'short-answer': 2,
    'long-answer': 5
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (form.title && form.answer) {
      const newQuestion = {
        ...form,
        marks: marksMap[form.type]
      };
      onAddQuestion(newQuestion);
      setForm({ title: '', answer: '', type: 'one-word' });
    }
  };

  return (
    <div className="question-form">
      <h4>Add Question</h4>
      <input
        type="text"
        name="title"
        placeholder="Question Title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="answer"
        placeholder="Correct Answer"
        value={form.answer}
        onChange={handleChange}
      />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="one-word">One Word (1 mark)</option>
        <option value="short-answer">Short Answer (2 marks)</option>
        <option value="long-answer">Long Answer (5 marks)</option>
      </select>
      <button onClick={handleAdd}>Add Question</button>
    </div>
  );
};

export default QuestionForm;
