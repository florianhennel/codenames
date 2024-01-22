import { PlayerInterface } from "./Game"

interface Props{
    message:string,
    player:PlayerInterface,
}
function Log({message,player}:Props){
    if(player.team === "blue"){
        return(
            <div className={` bg-cyan-400 flex flex-row gap-2 items-center`}>
                <p className=" text-blue-600 font-bold p-1"> {player.name}</p><p> gives clue </p><p className=" bg-white h-5/6 self-center uppercase font-bold opacity-0">{message}</p>
            </div>
        )
    }
    else{
        return(
            <div className={` bg-red-300 flex flex-row gap-2 items-center`}>
                 <p className=" text-red-600 font-bold p-1"> {player.name}</p><p> gives clue </p><p className=" bg-white h-5/6 self-center uppercase font-bold opacity-0">{message}</p>
            </div>
        )
    }
}

export default Log