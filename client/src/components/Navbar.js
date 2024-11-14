import React from 'react';
import logo from '../assets/gethepricelogo.PNG'
const Navbar = () => {
  return (
    <nav className=" bg-[#575757] text-white py-4">
      <div className='max-w-7xl flex justify-between items-center mx-auto'>
        <div className="text-2xl font-bold">
          <img src={logo} className='h-10 ml-4'></img>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="text-xl mr-4">Contact Us</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
