import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles/ExperienceCard.css'

const ExperienceCard = ({ id,company,role,status }) => {
    const [likes,setLikes]=useState(0);
    const [dislikes,setDislikes]=useState(0);
    const [report,setReport]=useState(0);
    return (
        <>
            <div className='card'>
                <h1>{company}</h1>
                <h2>Role: {role}</h2>
                <h3>{status}</h3>
                <Link to={`/experience/${id}`}>View more</Link>
                <div className='btn'>
                    <button onClick={() => setLikes(likes+1)}>{likes} like</button>
                    <button onClick={() => setDislikes(dislikes+1)}>{dislikes} Dislike</button>
                    <button onClick={() => setReport(report+1)}>{report} Report</button>
                </div>
            </div>
        </>
    )
}

export default ExperienceCard;