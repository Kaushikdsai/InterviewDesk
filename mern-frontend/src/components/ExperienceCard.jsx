import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import '../styles/ExperienceCard.css'
import thumbsDown from '../assets/thumb-down.png'
import thumbsUp from '../assets/thumb-up (1).png'
import reportIcon from '../assets/flag.png'
import axios from 'axios';

const ExperienceCard = ({ id,company,role,status,studentName,studentBatch,currentUser,onDelete }) => {
    const [likes,setLikes]=useState(0);
    const [dislikes,setDislikes]=useState(0);
    const [report,setReport]=useState(0);

    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log("ADMIN : "+currentUser?.isAdmin);
        axios.get(`http://localhost:5000/api/posts/${id}`)
            .then(res => {
                setLikes(res.data.likes);
                setDislikes(res.data.dislikes);
                setReport(res.data.report);
                console.log("RES: "+res);
            })
            .catch(err => console.error(err));
    }, [id]);

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

    const handleReaction = async (type) => {
        try{
            const res=await axios.patch(`http://localhost:5000/api/posts/${id}/reaction`, {type},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setLikes(res.data.likes);
            setDislikes(res.data.dislikes);
            setReport(res.data.report);
        }
        catch(err){
            console.error(err);
        }
    };

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
                    <button className='reaction-btn' title="Like" onClick={() => handleReaction('like')}><img src={thumbsUp} /> {likes}</button>
                    <button className='reaction-btn' title="Dislike" onClick={() => handleReaction('dislike')}><img src={thumbsDown} /> {dislikes}</button>
                    <button className='reaction-btn' title="Report" onClick={() => handleReaction('report')}><img src={reportIcon} /> {report}</button>
                </div>
                <br />
                {currentUser?.isAdmin && (
                    <button title='' className='-btn' onClick={() => onDelete(id)}>
                        Delete
                    </button>
                )}
            </div>
        </>
    )
}

export default ExperienceCard;