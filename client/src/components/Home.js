import React, { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios'
import Spinner from './Spinner';
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSearch = async() => {
        try {
            setIsLoading(true);
            const res=await axios.post('http://localhost:8000/product/get-product', {
                url: searchQuery,
            })
            console.log(res);
 
        } catch (error) {
            console.error('Error fetching data:', error);
        }finally{
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <div className="w-full max-w-2xl mb-6 flex">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="https://www.flipkart.com/canon-eos-3000d-dslr-camera-1-body-18-55-mm-lens..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D9FF05]"
                />
                <button className="bg-[#575757] max-w-xl text-[#D9FF05] px-4 py-2 rounded-r-md hover:bg-gray-700 flex items-center" onClick={handleSearch}>
                    {!isLoading?(<Search className="w-5 h-5 mr-1" />)
                        : <Spinner />}
                    {!isLoading?"Search":""}
                </button>
            </div>
            <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Product Information</h2>
                <div className="text-gray-600">
                    <p>Here, details about the product will be displayed after searching.</p>
                    <p>Information could include the product name, description, price, ratings, etc.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
