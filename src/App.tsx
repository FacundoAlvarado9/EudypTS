import { useEffect, useState } from 'react'
import './App.css'
import DatasetEditor from './components/DatasetEditor'
import type { Dataset } from './types/Dataset'

function App() {
  const [reference, setReference] = useState<Dataset | null>(null);
  const [target, setTarget] = useState<Dataset | null>(null);

  useEffect(() => {     
    if(reference && target){
      //For debugging purposes      
      console.log("target", target);
      console.log("reference", reference);
    }
  }, [reference, target]);

  return (
    <>
    <div className="parent">
      <div className="child">
        <h3>Reference Dataset</h3>
        <DatasetEditor onDatasetChange={setReference}/>
      </div>
      <div className="child center-buttons">
        <div className="top-button">
          <select name="distance-measure" id="distanceDropdown">
            <option value="0">Select distance measure</option>
          </select>
        </div>  
        <div className="bottom-button">
          <button id="compareBtn">Compare</button>
        </div>              
      </div>
      <div className="child">
        <h3>Target Dataset</h3>
        <DatasetEditor onDatasetChange={setTarget}/>
      </div>      
    </div>      
    </>
  )
}

export default App
