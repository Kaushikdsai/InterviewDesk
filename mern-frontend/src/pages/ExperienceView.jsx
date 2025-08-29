import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard'; 
import '../styles/ExperienceView.css'

const ExperienceView = () => {
    const [posts,setPosts]=useState([]);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate();

    useEffect(() => {
        const fetchPosts=async () => {
            try{
                const res=await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
            }
            catch(err){
                console.error(err);
            }
            finally{
                setLoading(false);
            }
        };
        fetchPosts();
    },[]);

    if(loading){
        return <h1>Loading...</h1>
    }

    return (
        <div className='exp-view-container'>
            <button className='interview-exp-btn' onClick={() => navigate('/add-experience')}>Share your interview experience</button>
            <div>
                {posts.length>0 ? (
                    posts.map(post => (
                        <div>
                            <ExperienceCard key={post._id} id={post._id} role={post.role} company={post.company} status={post.status} />
                        </div>
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    )
}

export default ExperienceView;