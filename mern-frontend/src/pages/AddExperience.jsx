import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddExperience = () => {
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        company: '',
        role: '',
        status: '',
        experience: '',
        questions: '',
        additionalInfo: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const payload = {
                company: formData.company,
                role: formData.role,
                status: formData.status,
                experience: formData.experience,
                questions: formData.questions.split('\n'),
                additionalInfo: formData.additionalInfo
            };
            const token=localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/posts', payload, {
                headers: {Authorization: `Bearer ${token}`}
            });

            navigate('/experienceView');
        }
        catch(err){
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Post your interview experience</h1>
            <input id='company' name='company' onChange={handleChange} placeholder='Enter company name' value={formData.company} required/>
            <input id='role' name='role' onChange={handleChange} placeholder='Enter role' value={formData.role} required/>
            <select name='status' onChange={handleChange} value={formData.status} required>
                <option value="" disabled>Select job status</option>
                <option>Accepted</option>
                <option>Rejected</option>
                <option>Declined</option>
            </select>
            <textarea id='experience' name='experience' value={formData.experience} onChange={handleChange} placeholder='Describe your interview experience' required />
            <textarea id='questions' name='questions' value={formData.questions} onChange={handleChange} placeholder='One question per line' />
            <textarea id='additionalInfo' name='additionalInfo' value={formData.additionalInfo} onChange={handleChange} placeholder='Optional additional information' />
            <button type='submit'>Submit</button>
        </form>
    )
}

export default AddExperience;