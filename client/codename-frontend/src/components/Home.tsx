import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

function Home(){
    const [nameInput,changeNameInput] = useState<string>("");
    const navigate = useNavigate();
    const socket = useSocket();
    function addObjectToList(newObject:Object) {
        // Retrieve the existing list from localStorage
        const existingListString = localStorage.getItem('game');
        const existingList = existingListString ? JSON.parse(existingListString) : [];
      
        // Add the new object to the list
        existingList.push(newObject);
      
        // Store the updated list back in localStorage
        localStorage.setItem('game', JSON.stringify(existingList));
      }
  const createNewRoom = async () => {
    if (nameInput.length>0) {
       const response = await fetch("https://jg7jbvcz-3000.euw.devtunnels.ms/createRoom",{
        method:"POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body:JSON.stringify({
            name:nameInput,
        })
    })
    const json = await response.json();
    const id = json.roomid;
    const gameObj = {gameid:id,name:nameInput};
    
    addObjectToList(gameObj);
    socket?.emit('join-game',nameInput,id);
    navigate(`/game/${id}`);
     
    }else{
        alert("Nincs megadva a neved!")
    }
  }
    return(
        <div className="flex items-center justify-center flex-col bg-gradient-to-l from-red-400 to-teal-500 h-full w-full">
            <div className="rounded-xl bg-white flex items-center justify-center flex-col gap-4 p-7">
                <p>Add meg a neved:</p>
                <input onChange={(event)=>changeNameInput(event.target.value)} className="rounded-lg ring-2" type="text" defaultValue={""}/>
                <button className=" rounded-2xl bg-amber-300 text-4xl font-bold p-4 uppercase" onClick={createNewRoom}>Create Room</button>
            </div>
        </div>
    )
}

export default Home