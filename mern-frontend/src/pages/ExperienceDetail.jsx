import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ExperienceDetail = () => {
    const {id}=useParams();
    const [experience,setExperience]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(() => {
        const fetchExperience=async () => {
            try{
                const res=await axios.get(`http://localhost:5000/api/experience/${id}`);
                setExperience(res.data);
            }
            catch(err){
                console.error(err);
                setError('Failed to load');
            }
            finally{
                setLoading(false);
            }
        };
        fetchExperience();
    }, [id]);

    if(loading){
        return <h1>Loading...</h1>
    }
    if(error){
        return <h2 style='color: red'>Error</h2>
    }
    return (
        <div className='detail-card'>
            <h1>{experience.company}</h1>
            <h2>Role: {experience.role}</h2>
            <h3>Status: {experience.status}</h3>
            <h4>Interview experience</h4>
            <p>{experience.interviewExp}</p>
            <h4>Interview questions</h4>
            <p>{experience.interviewQns}</p>
            <h5>Additional Info</h5>
            <p>{experience.addInfo}</p>
        </div>
    )
}

export default ExperienceDetail;