import { useEffect, useState } from 'react';
import { PlayerInterface } from './Game';
import Agent from './Agent';
import Player from './Player';
interface Props{
    color:"black"|"red"|"blue"|"gray",
    cardsLeft:Number,
    isInTeam:boolean,
    join:any,
    team:PlayerInterface[],
}

function TeamCard({color,cardsLeft,isInTeam,join,team}:Props){
    const joinSpymaster = ()=>{
        join(color,"spymaster");
    }
    const joinOperative = ()=>{
        join(color,"operative");
    }
    const [teamState,setTeamState] = useState<PlayerInterface[]>(team);
    useEffect(()=>{
        setTeamState(team);
    },[team]);
    return(
        <div className={`${color==="blue"?" bg-blueBgColor":" bg-redBgColor"} rounded-3xl lg:m-5 flex p-2 lg:p-6 ring-1 ring-black shadow-2xl h-full lg:min-h-1/4`}>
            <div className="flex flex-col w-full h-full">
                <div className=' flex flex-row justify-center lg:justify-between lg:h-1/3'>
                    {
                        color==="red"? 
                        <>
                            <div className=' w-1/3 hidden lg:block lg:visible'>  
                                <Agent loaded={true} color={color} agent={cardsLeft} onTeamCard={true} />
                            </div>
                            <div className=" text-xl md:text-3xl lg:text-5xl font-bold text-neutral-300">
                                {cardsLeft.toString()}
                            </div>
                        </>:
                        <>
                            <div className=" text-xl md:text-3xl lg:text-5xl font-bold text-neutral-300">
                                {cardsLeft.toString()}
                            </div>
                            <div className='aspect-square  w-1/3 hidden lg:block lg:visible'>
                                <Agent onTeamCard={true} loaded={true} color={color} agent={cardsLeft} />
                            </div>
                            
                        </>
                    }
                    
                </div>
                
                
                <div className="flex flex-col lg:h-1/3">
                    <div className='text-neutral-300 text-sm lg:text-xl'>Operatives</div>
                    <div className=' flex flex-row flex-wrap text-neutral-300 text-sm lg:text-xl'>
                        {
                            teamState.filter(t=>t.role==="operative").length>0?teamState?.filter(t=>t.role==="operative").map(t=>(
                                <Player player={t} />
                            )):'-'
                        }
                    </div>
                    <button className={`capitalize ${isInTeam?"hidden":"visible"} bg-yellow-400 rounded-3xl text-center text-sm lg:text-lg lg:p-2 lg:w-1/2`} onClick={joinOperative}>join as operative</button>
                </div>
                <div className='flex flex-col lg:h-1/3'>
                    <div className='text-neutral-300 text-sm lg:text-xl'>SpyMasters</div>
                    <div className='flex flex-row flex-wrap text-neutral-300 text-sm lg:text-xl'>
                        {
                            teamState.filter(t=>t.role==="spymaster").length>0?teamState?.filter(t=>t.role==="spymaster").map(t=>(
                                <Player player={t} />
                            )):'-'
                        }
                    </div>
                    <button className={`capitalize ${isInTeam?"hidden":"visible"} bg-yellow-400 rounded-3xl text-center text-sm lg:text-lg lg:p-2 lg:w-1/2`} onClick={joinSpymaster}>join as spymaster</button>
                </div>
            </div>
        </div>
    )
}
export default TeamCard