import './App.css';
import Footer from './components/Footer';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      <Home/>
      <main className="flex-grow">
        {/* Main content goes here */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
