import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
interface MyObject {
    gameid: string;
    name: string;
  }
function Join(){
    const [nameInput,changeNameInput] = useState<string>("");
    const navigate = useNavigate();
    const gameid = useParams().id;
    function addObjectToList(newObject:MyObject) {
        // Retrieve the existing list from localStorage
        const existingListString = localStorage.getItem('game');
        const existingList = existingListString ? JSON.parse(existingListString) : [];
      
        // Add the new object to the list
        existingList.push(newObject);
      
        // Store the updated list back in localStorage
        localStorage.setItem('game', JSON.stringify(existingList));
      }
  const joinGame = async () => {
    if (nameInput.length>0) {
       const response = await fetch("https://jg7jbvcz-3000.euw.devtunnels.ms/joinRoom",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                name:nameInput,
                })
        })
        await response.json();
        const gameObj:MyObject = {
            gameid:gameid!,
            name:nameInput,
        };
        addObjectToList(gameObj);
        navigate(`/game/${gameid}`); 
    }else{
        alert("Nincs megadva a neved!")
    }
    
  }
  useEffect(() => {
    // Check if the gameid is present in localStorage
    const listString = localStorage.getItem('game');
    const list: MyObject[] = listString ? JSON.parse(listString) : [];

    const foundObject = list.find(obj => obj.gameid === gameid);

    if (foundObject) {
      // If the object with the specified gameid is found, navigate to the corresponding game page
      navigate(`/game/${gameid}`);
    }
  }, []);
    return(
        <div className="flex items-center justify-center flex-col bg-gradient-to-l from-red-400 to-teal-500 h-full w-full">
            <div className="rounded-xl bg-white flex items-center justify-center flex-col gap-4 p-7">
                <p>Add meg a neved:</p>
                <input onChange={(event)=>changeNameInput(event.target.value)} className="rounded-lg ring-2" type="text" />
                <button className=" rounded-2xl bg-amber-300 text-4xl font-bold p-4 uppercase" onClick={joinGame}>Csatlakozás a szobához</button>
            </div>
        </div>
    )
}

export default Join