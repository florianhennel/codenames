import { useState,useEffect } from "react";
import Agent from "./Agent";
import { PlayerInterface } from "./Game"


interface Props{
    img:string,
    color:"black"|"red"|"blue"|"gray",
    player:PlayerInterface,
    givenClue:boolean,
    currentTeam:"red"|"blue",
    cardsLeft:Number,
    grayCards:Number,
    guess:any,
    revealed:boolean,
    hinted:boolean,
    hint:any,
}

function Card({img,color,player,givenClue,currentTeam,guess,cardsLeft,grayCards,revealed,hinted,hint}:Props){
    const [guessed,setGuessed] = useState<boolean>(false);
    const [revealedAgentNumber, setRevealedAgentNumber] = useState<Number>(1);
    const [thisClient,setThisClient] = useState<boolean>(false);
    const [clicked,setClicked] = useState<boolean>(false);
    const [imageLoaded,setImageLoaded] = useState<boolean>(false);

    const clickOnGuess = (event:React.BaseSyntheticEvent)=>{
        setThisClient(true);
        setGuessed(true);
        if (color === "gray") {
            setRevealedAgentNumber(grayCards);
        }else{
            setRevealedAgentNumber(cardsLeft);
        }
        
        guess(event);
    }
    const Load = ()=>{
        setImageLoaded(true);
    }
    useEffect(()=>{
        setGuessed(revealed);
    },[revealed])
    useEffect(()=>{
        setClicked(hinted);
    },[hinted])
    const clickOnCard =()=>{
        if (player.team === currentTeam && player.role === "operative" && givenClue) {
            setClicked(!clicked);
            hint(event);
        }   
    }
    useEffect(() => {
        if (!guessed) {
            if (color==="gray") {
                setRevealedAgentNumber(grayCards);
            }
            else{
                setRevealedAgentNumber(cardsLeft);
            }
        }
      }, [cardsLeft,grayCards,revealed]);
    const card = <div key={img} className={` relative aspect-square w-full h-full cursor-pointer`}>
            <img onLoad={Load} className={` w-full h-full object-cover ${guessed?"hidden":"visible"}`} src={`../images/cards/card-${img}.jpg`} data-key={img} alt="" onClick={clickOnCard} />
            <button data-key={img} data-color={color} className={`bg-tap-icon bg-cover w-10 h-10 absolute -top-3 -right-3 ${(!player?.team||currentTeam != player?.team || player.role ==="spymaster"|| !givenClue || revealed)?"hidden":"visible"}`} onClick={clickOnGuess}></button>
            <span data-key={img} onClick={clickOnCard} className={`text-5xl m-1 -translate-y-2 absolute font-bold ${currentTeam==="red"?"text-red-600":"text-blue-700"} top-0 left-0 ${clicked?"visible":"hidden"}`}>?</span>
            <span className={`w-4 h-4 absolute top-2 right-2 ${color==="blue" && "bg-blue-800"} ${color==="red" && "bg-red-500"} ${color==="black" && "bg-black"} ${(player?.role ==="spymaster" && !revealed)?"visible":"hidden"}`}></span>
        </div>;
    return(
        <Agent onTeamCard={false} color={color} agent={revealedAgentNumber} loaded={imageLoaded} thisClient={thisClient} card={card} />
    )
}

export default Card