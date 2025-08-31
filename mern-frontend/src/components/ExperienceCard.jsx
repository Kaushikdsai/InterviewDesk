import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles/ExperienceCard.css'
import thumbsDown from '../assets/thumb-down.png'
import thumbsUp from '../assets/thumb-up (1).png'
import reportIcon from '../assets/flag.png'

const ExperienceCard = ({ id,company,user,role,status,studentName,studentBatch,onDelete }) => {
    const [likes,setLikes]=useState(0);
    const [dislikes,setDislikes]=useState(0);
    const [report,setReport]=useState(0);

    const getColor = () => {
        if(status.toLowerCase()==='accepted'){
            return 'green';
        }
        if(status.toLowerCase()==='rejected'){
            return 'red';
        }
        if(status.toLowerCase()==='declined'){
            return 'black';
        }
    }

    return (
        <>
            <div className='top-layer' style={{ backgroundColor: getColor() }}></div>
            <div className='card'>
                <h1>{company}</h1>
                <h2>Role: {role}</h2>
                <br />
                <h3 style={{ color: getColor() }}>{status}</h3>
                <p>- {studentName}{studentBatch && <span>({studentBatch})</span> }</p>
                {studentBatch && <p>Batch: {studentBatch}</p>}
                <Link to={`/experience/${id}`}>View more</Link>
                <br />
                <div className='btn'>
                    <button className='reaction-btn' title="Like" onClick={() => setLikes(likes+1)}><img src={thumbsUp} /> {likes}</button>
                    <button className='reaction-btn' title="Dislike" onClick={() => setDislikes(dislikes+1)}><img src={thumbsDown} /> {dislikes}</button>
                    <button className='reaction-btn' title="Report" onClick={() => setReport(report+1)}><img src={reportIcon} /> {report}</button>
                </div>
                <br />
                {user?.role==='admin' && (
                    <button title='Delete' className='delete-btn' onClick={() => onDelete(id)}>
                        Delete
                    </button>
                )}
            </div>
        </>
    )
}

export default ExperienceCard;