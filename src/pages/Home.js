import React, { useState,useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllData, logout, uploadMedia } from '../service/ApiService';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import axios from "axios";

import pdf_image from '../assets/pdf.png';  
import { saveAs } from 'file-saver'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [files,setFiles] = useState([]);
  const [filter,setFilter] = useState('');
  let  navigate = useNavigate();
  let asset_url = 'http://localhost/projects/react/upload-media-admin/assets/uploads/';

  useEffect(()=>{
    getFullData();
  },[]);

  const getFullData = async () => {
    let res = await getAllData(localStorage.getItem('MYAppToken'));
    setFiles(res['data']['data']);
    console.log(res);
  }

  const logoutUser = async () => {
    let token = localStorage.getItem('MYAppToken');
    let res = await logout({'token':token});
    if(res['data']){
      localStorage.clear();
      navigate('/login');
    }
  }
    
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const fileInput = document.getElementsByName('uploadData');
    // console.log();
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('token',localStorage.getItem('MYAppToken'));
    
    try {
      const response = await uploadMedia(formData);
      if(response['status'] === 200 ){
        fileInput[0].value = null;
        setSelectedFile(null);
        getFullData();
        toast.success('file added successfully');
        console.log('File uploaded successfully', response.data);
      }
    } catch (error) {
      toast.success('failed to upload file');
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = (file_name) => {
    saveAs( `${asset_url}${file_name}`, file_name);
  }

  const handleFilter = (filter) => {
    setFilter(filter);
  }

  return (
  <>
    <ToastContainer />
    <div className='header'>
      <h3><p>Home</p></h3>
      <h3><p onClick={()=>{ logoutUser() }} className='logoutButton'>logout</p></h3> 
    </div>
    <div>
      <h2>Upload a file</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="uploadData" onChange={handleFileSelect} />
        {(selectedFile && (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg')) &&  <img src={URL.createObjectURL(selectedFile)} alt="Selected Image" style={{ maxWidth: '200px', maxHeight: '200px', margin: '10px 0' }} />}
        <button type="submit">Submit</button>
      </form>
    </div>
    <div>
      <h2>Files</h2>
      <div className='filter'>
        <div>Filter -</div>
        <div className='filter-opt' onClick={()=>{ handleFilter('') }}>  all  </div>||
        <div className='filter-opt' onClick={()=>{ handleFilter('image') }}> images  </div>||
        <div className='filter-opt' onClick={()=>{ handleFilter('doc') }}>  documents </div>
      </div>
      <div className='images-grid'>

        {
          files && files.map((data)=>{
            return (
              <>
                  {
                    data['file_type'] === 'image/png' || 
                    data['file_type'] === "image/jpeg" ?
                    <>
                      {
                        filter === 'image' || filter === '' ? 
                          <div className='doc-cart'>
                            <img onClick={()=>{ handleDownload(data['file_name']) }}  src={`${asset_url}${data['file_name']}`} alt="File" />
                            <p className='doc-title'>{data['file_name']}</p>
                            <button onClick={()=>{handleDownload(data['file_name']) }}>download</button>
                          </div> : <></>
                      }                      
                    </> : 
                    data['file_type'] === 'application/pdf' ? 
                    <>
                      {
                        filter === 'doc' || filter === '' ? 
                          <div className='doc-cart'>
                            <div className='pdf-contant' onClick={()=>{ window.open(`${asset_url}${data['file_name']}`, '_blank', 'noopener,noreferrer') }}>
                              <img src={pdf_image} alt="" />  
                            </div>
                            <p className='doc-title'>{data['file_name']}</p>
                            <button onClick={()=>{handleDownload(data['file_name']) }}>download</button>
                          </div>: <></>
                      }
                        
                    </> :
                    <>
                    </>
                  }
              </>
            )
          })
        }
      </div>
    </div>
  </>
  )
}

export default Home