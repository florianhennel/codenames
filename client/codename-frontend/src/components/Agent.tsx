
interface Props{
    color:"black"|"red"|"blue"|"gray",
    agent:Number,
    card?:JSX.Element,
    thisClient?:boolean,
    loaded:boolean,
    onTeamCard:boolean,
}

function Agent({color,agent,card,thisClient,loaded,onTeamCard}:Props){
    let agentNum;
    if (thisClient != undefined) {
        agentNum = thisClient?agent:(Number(agent)+1);
    }
    else{
        agentNum = agent;
    }
    let result;
    if (color==="blue") {
        switch (agentNum) {
            case 1:
                result = <div className={`  h-auto w-auto ${onTeamCard?"w-full":""}  aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-1`}>{card}</div></div>;
                break;
            case 2:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-2`}>{card}</div></div>;
                break;
            case 3:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-3`}>{card}</div></div>;
                break;
            case 4:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-4`}>{card}</div></div>;
                break;
            case 5:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-5`}>{card}</div></div>;
                break;
            case 6:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-6`}>{card}</div></div>;
                break;
            case 7:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-7`}>{card}</div></div>;
                break;
            case 8:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-8`}>{card}</div></div>;
                break;
            case 9:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-9`}>{card}</div></div>;
                break;
            case 10:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-blue-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-blue-agent bg-blue-agent-9`}>{card}</div></div>;
                    break;
        }
    }else if(color === "red"){
        switch (agentNum) {
            case 1:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-1`}>{card}</div></div>;
                break;
            case 2:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-2`}>{card}</div></div>;
                break;
            case 3:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-3`}>{card}</div></div>;
                break;
            case 4:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-4`}>{card}</div></div>;
                break;
            case 5:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-5`}>{card}</div></div>;
                break;
            case 6:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-6`}>{card}</div></div>;
                break;
            case 7:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-7`}>{card}</div></div>;
                break;
            case 8:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square  bg-red-agent bg-red-agent-8`}>{card}</div></div>;
                break;
            case 9:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={` aspect-square bg-red-agent bg-red-agent-9`}>{card}</div></div>;
                break;
            case 10:
                result = <div className={` h-auto w-auto ${onTeamCard?"w-full":""} aspect-square bg-card-back bg-red-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={` aspect-square bg-red-agent bg-red-agent-9`}>{card}</div></div>;
                break;
        }
    }
    else if (color === "gray"){
        switch (agentNum) {
            case 1:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-1`}>{card}</div></div>;
                
                break;
            case 2:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-2`}>{card}</div></div>;
                break;
            case 3:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-3`}>{card}</div></div>;
                break;
            case 4:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-4`}>{card}</div></div>;
                break;
            case 5:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-5`}>{card}</div></div>;
                break;
            case 6:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-6`}>{card}</div></div>;
                break;
            case 7:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-7`}>{card}</div></div>;
                break;
            case 8:
                result = <div className={` h-auto w-auto aspect-square bg-card-back bg-gray-pos rounded-xl ${loaded?"visible":"hidden"}`}><div className={`aspect-square bg-gray-agent bg-gray-agent-7`}>{card}</div></div>;
                break;

        }
    }else{
        result = <div className={` h-auto w-auto aspect-square bg-black-agent bg-cover bg-black-pos rounded-xl ${loaded?"visible":"hidden"}`}>{card}</div>;
    }
    return(
        <>
            {result}
        </>
    )
}

export default Agent