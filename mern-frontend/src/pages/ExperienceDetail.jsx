import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js/dist/html2pdf';
import '../styles/ExperienceDetail.css';

const ExperienceDetail = () => {
    const { id }=useParams();
    const [experience, setExperience]=useState(null);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

    const pdfRef=useRef(null);

    useEffect(() => {
        const fetchExperience=async () => {
            try{
                const res=await axios.get(`http://localhost:5000/api/posts/${id}`);
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

    const downloadPDF = () => {
        console.log("pdfRef:", pdfRef.current);
        if (!pdfRef.current) return;
        setTimeout(() => {
            html2pdf()
              .from(pdfRef.current)
              .set({
                  margin: 0.5,
                  filename: `${experience.company}-Interview-Experience.pdf`,
                  html2canvas: { scale: 2 },
                  jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
              })
              .save();
        }, 0);
    };

    if(loading) return <h1>Loading...</h1>;
    if(error) return <h2 style={{ color: 'red' }}>Error</h2>;

    return (
        <>
            <button
                className="download-btn"
                onClick={downloadPDF}
                disabled={!experience}
            >
                Download as PDF
            </button>

            <div className="detail-card" ref={pdfRef}>
                <h1>{experience.company}</h1>
                <h2>Role: {experience.role}</h2>
                <h3 className={`status-${experience.status.toLowerCase()}`}>
                    Status: {experience.status}
                </h3>
                <h4>Interview Experience</h4>
                <p>{experience.experience}</p>
                <h4>Interview Questions</h4>
                <ol>
                    {experience.questions.map((qn, idx) => (
                        <li key={idx}>{qn}</li>
                    ))}
                </ol>
                <h5>Additional Info</h5>
                <p>{experience.additionalInfo}</p>
            </div>
        </>
    );
};

export default ExperienceDetail;
