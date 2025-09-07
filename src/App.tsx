import { useCallback, useEffect, useState } from 'react'
import './App.css'
import DatasetEditor from './components/DatasetEditor'
import type { TableData } from './types/Dataset'
import useTSCompare from './hooks/useTSCompare';
import Dropdown from './components/Dropdown';
import EDetailedView from './components/charts/EDetailedView';
import ErrorAlert from './components/error-alert/ErrorAlert';

function App() {
  const [reference, setReference] = useState<TableData | null>(null);
  const [target, setTarget] = useState<TableData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
        compare,
        result,
        isLoading,
        error,
        blankError,
        handleSelectStrategy,
        setReferenceDateColumn,
        setTargetDateColumn,
        availableComparators
    } = useTSCompare();

  // For debugging purposes
  useEffect(() => {     
    if(reference && target){  
      //console.log("target", target);
      //console.log("reference", reference);
    }
  }, [reference, target]);

  // For debugging purposes
  useEffect(() => {
    console.log("Result", result);
  }, [result]);

  useEffect(() => {
    if(error){
      setErrorMessage(error);
    }
  }, [error]);

  useEffect(() => {
    if(result?.status === "Error"){
      setErrorMessage(result.errorMessage);
    }
  }, [result]);

  const handleRunComparison = () => {
    blankErrorMessage();
    if(!reference){
      setErrorMessage("There is no reference dataset");
    } else if(!target){
      setErrorMessage("There is no target dataset");
    } else{
      compare(reference, target);
    }    
  }

  const blankErrorMessage = useCallback(() => {
    if(errorMessage){
      setErrorMessage(null);
    }
    if(error){
      blankError();
    }
  }, [errorMessage]);

  return (
    <>
    {(errorMessage) && (
      <ErrorAlert message={errorMessage} onClose={blankErrorMessage} />
    )}

    <div className="parent">
      <div className="child">
        <h3>Reference Dataset</h3>        
        <DatasetEditor tableName={"reference"} table={reference} onDatasetChange={setReference} onError={setErrorMessage} onChangeDateColumn={setReferenceDateColumn}/>  
      </div>

      <div className="child center-buttons">
        <Dropdown options={availableComparators.current.map((comparator, index) => ({ id: index.toString(), label: comparator }))} onChange={(optionId) => handleSelectStrategy(parseInt(optionId))} id={'strategySelector'}/>
        <div className="bottom-button">
          <button id="compareBtn" onClick={handleRunComparison} disabled={isLoading}>Compare</button>
        </div>              
      </div>

      <div className="child">
        <h3>Target Dataset</h3>
        <DatasetEditor tableName={"target"} table={target} onDatasetChange={setTarget} onError={setErrorMessage} onChangeDateColumn={setTargetDateColumn}/>  
      </div>

    </div>
    <div>
      {result && target && reference && (
        <>
        <EDetailedView result={result} referenceTable={reference} targetTable={target} />
        </>
      )}
    </div>   
    </>
  )
}

export default App