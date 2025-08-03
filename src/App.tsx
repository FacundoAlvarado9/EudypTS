import { useEffect, useState } from 'react'
import './App.css'
import DatasetEditor from './components/DatasetEditor'
import type { TableData } from './types/Dataset'
import useTSCompare from './hooks/useTSCompare';
import Dropdown from './components/Dropdown';

function App() {
  const [reference, setReference] = useState<TableData | null>(null);
  const [target, setTarget] = useState<TableData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { availableStrategies, handleSelectStrategy, setReferenceDateColumn, setTargetDateColumn, runComparison, result } = useTSCompare();

  // For debugging purposes
  useEffect(() => {     
    if(reference && target){  
      console.log("target", target);
      console.log("reference", reference);
    }
  }, [reference, target]);

  // For debugging purposes
  useEffect(() => {
    console.log("Result", result);
  }, [result]);

  useEffect(() => {
    if(result?.status === "Error"){
      setErrorMessage(result.errorMessage);
    }
  }, [result]);

  const handleRunComparison = () => {
    blankErrorMessage();
    if(reference?.data && target?.data){
        runComparison(reference, target);
    } else {
      setErrorMessage("Comparison cannot be run on empty datasets");
    }
  }

  const blankErrorMessage = () => {
    if(errorMessage){
      setErrorMessage(null);
    }
  }

  return (
    <>
    {errorMessage && (
      <div className='error-bar'>
        <p>Error: {errorMessage}</p>
        <p onClick={_e => {blankErrorMessage()}} className='underlineOnHover'>[X]</p>
      </div>
    )}

    <div className="parent">
      <div className="child">
        <h3>Reference Dataset</h3>
        {reference?.headers && 
          <Dropdown
            options={[
              { id: "-1", label: "No timestamp column" },
              ...reference.headers.map((header, index) => ({ id: index.toString(), label: header }))
            ]}
            onChange={(optionId) => setReferenceDateColumn(parseInt(optionId))}
            id={'referenceDateSelector'}
          />
        }        
        <DatasetEditor onDatasetChange={setReference} onError={setErrorMessage}/>
      </div>

      <div className="child center-buttons">
        <Dropdown options={availableStrategies.map((strategy, index) => ({ id: index.toString(), label: strategy }))} onChange={(optionId) => handleSelectStrategy(parseInt(optionId))} id={'strategySelector'}/>
        <div className="bottom-button">
          <button id="compareBtn" onClick={handleRunComparison}>Compare</button>
        </div>              
      </div>

      <div className="child">
        <h3>Target Dataset</h3>
        {target?.headers && 
          <Dropdown
            options={[
              { id: "-1", label: "No timestamp column" },
              ...target.headers.map((header, index) => ({ id: index.toString(), label: header }))
            ]}
            onChange={(optionId) => setTargetDateColumn(parseInt(optionId))}
            id={'targetDateSelector'}
          />
        }
        <DatasetEditor onDatasetChange={setTarget} onError={setErrorMessage}/>
      </div>

    </div>      
    </>
  )
}

export default App

/*
<div className="child">
        <h3>Reference Dataset</h3>
        {reference?.headers && <Dropdown elementId={'refDateColSelector'} options={reference.headers} placeholder="None" onChangeSelectedValue={setReferenceDateColumn}/>}        
        <DatasetEditor onDatasetChange={setReference}/>
      </div>

      <div className="child center-buttons">
        <Dropdown elementId={"distanceStrategySelector"} options={availableStrategies} placeholder="Select a strategy..." onChangeSelectedValue={(e: string) => {handleSelectStrategy(availableStrategies.indexOf(e))}}/>
        <div className="bottom-button">
          <button id="compareBtn" onClick={handleRunComparison}>Compare</button>
        </div>              
      </div>

      <div className="child">
        <h3>Target Dataset</h3>
        {target?.headers && <Dropdown elementId={'targetDateColSelector'} options={target.headers} placeholder="None" onChangeSelectedValue={setTargetDateColumn}/>}
        <DatasetEditor onDatasetChange={setTarget}/>
      </div>
*/