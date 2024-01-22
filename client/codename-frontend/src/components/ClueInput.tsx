import { useState } from "react"

interface Props{
    giveClue:any,
}

function ClueInput({giveClue}:Props){
    const [textInput,setTextInput] =useState<string>("");
    const [numberInput,setNumberInput] =useState<number>(1);
    const buttonHandler = ()=>{
        if (textInput.length>0) {
            giveClue(textInput,numberInput);
        }
    }
    return(
        <div className="flex flex-row w-3/4 p-1 gap-4 items-center justify-center">
            <input className=" w-2/3 rounded-lg h-3/4 text-xl font-semi-bold uppercase p-1" type="text" onChange={(event)=>setTextInput(event.target.value)} />
            <input className=" w-1/12 rounded-lg h-3/4 aspect-square text-xl text-center" inputMode="numeric" pattern="[1-9]" onChange={(event)=>setNumberInput(Number(event.target.value))} max={9} min={1} />
            <button className=" w-1/6 bg-lime-400 rounded-3xl h-3/4 text-xl ring-green-800" type="submit" onClick={buttonHandler}>Give Clue</button>
        </div>
    )
    
}

export default ClueInput