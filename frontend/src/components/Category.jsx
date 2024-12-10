import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Category = () => {

    const [category, setCategory] = useState([])

    useEffect(()=> {
        axios.get('http://localhost:5000/api/category')
        .then(result => {
            if(result.data.Status) {
                setCategory(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])

    const handledelete = (id) => {
    axios.delete(`http://localhost:5000/api/delete_category/${id}`) // Use backticks for template literal
        .then((result) => {
            if (result.data.Status) {
                // Update the category list by filtering out the deleted category
                setCategory(category.filter((category) => category._id !== id));
            } else {
                alert(result.data.Error); // Show error message from response
            }
        })
        .catch((err) => console.error("Error deleting category", err));
    };
    
  return (
<div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
            <h3>Category List</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    category.map(c => (
                        <tr>
                            <td>{c.name}</td>
                            <td>
                                <button onClick={()=> handledelete(c._id)} className="btn btn-info btn-sm me-2">Delete</button>
                            </td>
                        </tr>
                        
                    ))
                    }
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Category
