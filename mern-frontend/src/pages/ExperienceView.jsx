import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ExperienceCard from '../components/ExperienceCard'; 
import '../styles/ExperienceView.css'

const ExperienceView = () => {
    const [posts,setPosts]=useState([]);
    const [filteredPosts,setFilteredPosts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [loggedin,setLoggedin]=useState(false);

    const [roleFilter,setRoleFilter]=useState('');
    const [companyFilter,setCompanyFilter]=useState('');
    const [statusFilter,setStatusFilter]=useState('');
    const [nameFilter,setNameFilter]=useState('');
    const [batchFilter,setBatchFilter]=useState('');
    const [currentUser,setCurrentUser]=useState('');

    const navigate=useNavigate();
    const token=localStorage.getItem('token');

    useEffect(() => {
        if(!token){
            setLoggedin(false);
            navigate('/login');
            return;
        }
        if(token){
            setLoggedin(true);
            const decoded=jwtDecode(token);
            setCurrentUser({ isAdmin: decoded.isAdmin });
        }

        const fetchPosts=async () => {
            try{
                const res=await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data);
                setFilteredPosts(res.data);
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

    const applyFilters = async () => {
        try{
            const res=await axios.get('http://localhost:5000/api/posts', {
                params: {
                    role: roleFilter,
                    company: companyFilter,
                    status: statusFilter,
                    name: nameFilter,
                    batch: batchFilter
                }
            });
            setFilteredPosts(res.data);
        }
        catch(err){
            console.error(err);
        }
    };

    const handleDelete = async(id) => {
        try{
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            setPosts(prev => prev.filter(p => p._id !== id));
            setFilteredPosts(filteredPosts.filter(p => p._id !== id));
            alert('Post deleted successfully');
        }
        catch(err){
            console.error(err);
            alert('Failed to delete post');
        }
    }

    return (
        <div>
            {loggedin && (
                <div className='exp-view-container'>
                    <button className='interview-exp-btn' onClick={() => navigate('/add-experience')}>Share your interview experience</button>
                    <div className='filter-bar'>
                        <input placeholder='Search by role' value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} />
                        <input placeholder='Search by company' value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} />
                        <input placeholder='Search by job status' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
                        <input placeholder='Search by name' value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                        <input placeholder='Search by batch' value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} />
                        <br />
                        <button className='apply-filter-btn' onClick={applyFilters}>Apply Filter</button>
                    </div>
                    <div className='exp-container'>
                        <div className='exp-cards-container'>
                            {filteredPosts.length>0 ? (
                                filteredPosts.map(post => (
                                    <div key={post._id} className='exp-card'>
                                        <ExperienceCard id={post._id} role={post.role} company={post.company} status={post.status} studentName={post.author?.name} studentBatch={post.author?.batch} currentUser={currentUser} onDelete={handleDelete}/>
                                    </div>
                                ))
                            ) : (
                                <p>No posts found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )};
        </div>
    )
}

export default ExperienceView;