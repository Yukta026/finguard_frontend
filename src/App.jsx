import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import Predict from "./components/Predict";

function App() {
  return (
   <Router>
     <Navbar/>
     <div className="min-h-screen bg-gray-100 flex flex-col">
       <Routes>
         <Route path="/" element={<Dashboard/>} />
      
         <Route path="/predict" element={<Predict/>}/>
       </Routes>
     </div>
   </Router>
  );
}

export default App;
