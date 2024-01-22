import { PlayerInterface } from "./Game"

interface Props{
    player:PlayerInterface,
}

function Player({player}:Props){

    return(
        <div className={` inline-block ring-1 ring-neutral-300 rounded-md text-sm p-1 text-center text-neutral-300 m-1 font-bold`}>
            {player.name}
        </div>
    )
}
export default Player