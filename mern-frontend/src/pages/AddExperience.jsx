import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/AddExperience.css'
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
        const token=localStorage.getItem('token');
        if(!token){
            alert('You must be logged in!');
            return;
        }
        try{
            const payload = {
                company: formData.company,
                role: formData.role,
                status: formData.status,
                experience: formData.experience,
                questions: formData.questions.split('\n'),
                additionalInfo: formData.additionalInfo
            };
            await axios.post('http://localhost:5000/api/posts', payload, {
                headers: {Authorization: `Bearer ${token}`}
            });
            alert('Experience posted successfully!');
            navigate('/experience-view');
        }
        catch(err){
            console.error(err);
        }
    }

    return (
        <form className='add-exp-form' onSubmit={handleSubmit}>
            <h1>Post your interview experience</h1>
            <input id='company' name='company' onChange={handleChange} placeholder='Enter company name' value={formData.company} required/>
            <input id='role' name='role' onChange={handleChange} placeholder='Enter role' value={formData.role} required/>
            <select className='select-status' name='status' onChange={handleChange} value={formData.status} required>
                <option value="" disabled>Select job status</option>
                <option>Accepted</option>
                <option>Rejected</option>
                <option>Declined</option>
            </select>
            <textarea rows={5} id='experience' name='experience' value={formData.experience} onChange={handleChange} placeholder='Describe your interview experience' required />
            <textarea rows={5} id='questions' name='questions' value={formData.questions} onChange={handleChange} placeholder='One question per line' />
            <textarea rows={5} id='additionalInfo' name='additionalInfo' value={formData.additionalInfo} onChange={handleChange} placeholder='Optional additional information' />
            <button className='submit-btn' type='submit'>Submit</button>
        </form>
    )
}

export default AddExperience;