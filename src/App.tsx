import { useEffect, useState } from 'react'
import './App.css'
import DatasetEditor from './components/DatasetEditor'
import type { Dataset } from './types/Dataset'
import useTSCompare from './hooks/useTSCompare';

function App() {
  const [reference, setReference] = useState<Dataset | null>(null);
  const [target, setTarget] = useState<Dataset | null>(null);  

  const { availableStrategies, handleSelectStrategy, runComparison, result } = useTSCompare();

  useEffect(() => {     
    if(reference && target){
      //For debugging purposes      
      console.log("target", target);
      console.log("reference", reference);
    }
  }, [reference, target]);

  useEffect(() => {
    console.log("Result", result);
  }, [result]);

  const handleRunComparison = () => {
    if(reference?.data && target?.data){
      runComparison(reference?.data, target?.data);
    }    
  }

  return (
    <>
    <div className="parent">
      <div className="child">
        <h3>Reference Dataset</h3>
        <DatasetEditor onDatasetChange={setReference}/>
      </div>
      <div className="child center-buttons">
        <div className="top-button">
          <select name="distance-measure" id="distanceDropdown" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {handleSelectStrategy(Number(e.target.value))}}>
            {availableStrategies.map((strategy, index) => <><option value={index}>{strategy}</option></>)}
          </select>
        </div>  
        <div className="bottom-button">
          <button id="compareBtn" onClick={handleRunComparison}>Compare</button>
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
