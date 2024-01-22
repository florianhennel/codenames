import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import TeamCard from "./TeamCard";
import Log from "./Log";
import { useSocket } from "./SocketContext";
import ClueInput from "./ClueInput";
import Card from "./Card";
import Player from "./Player";

interface GameInterface{
    players:PlayerInterface[],
    cards:CardInterface[],
    game_log:LogInterface[],
    startTeam:"blue"|"red",
    redTeam:TeamInterface,
    blueTeam:TeamInterface,
    activeClue:boolean,
    revealedCards:string[],
    tries:Number,
    admin:string,
    currentClue:ClueInterface,
    curretTeam:"red"|"blue",
}
interface localStorageInterface{
    gameid:string,
    name:string,
}
interface CardInterface{
    img:string,
    team:"blue"|"red"|"black"|"gray",
}
interface TeamInterface{
    players:PlayerInterface[],
    cardsLeft:number,
}
export interface PlayerInterface{
    name:string,
    role:"spymaster"|"operative"|null,
    team?:"red"|"blue"|null;
    active?:boolean,
}
interface ClueInterface{
    text:string,
    number:Number,
}
interface LogInterface{
    text:string,
    player:PlayerInterface,
}
function Game(){
    const gameID = useParams().id;
    const navigate = useNavigate();
    const [name,setName] = useState<string>();
    const [team,setTeam] = useState<"blue"|"red"|null>();
    const [game,setGame] = useState<GameInterface>();
    const [bluePlayers,setBluePlayers] = useState<PlayerInterface[]>([]);
    const [redPlayers,setRedPlayers] = useState<PlayerInterface[]>([]);
    const [blueCardsLeft,setBlueCardsLeft] = useState<Number>(9);
    const [redCardsLeft,setRedCardsLeft] = useState<Number>(9);
    const [currentTeam,setCurrentTeam] = useState<"red"|"blue">();
    const [givenClue,setGivenClue] = useState<boolean>();
    const [player,setPlayer] = useState<PlayerInterface>();
    const [clue,setClue] = useState<ClueInterface>();
    const [gameLog,setGameLog] = useState<LogInterface[]>([]);
    const [grayCards,setGrayCards] = useState<Number>(7);
    const [revealedCards,setRevealedCards] = useState<string[]>([]);
    const [winner,setWinner] = useState<"red"|"blue">();
    const [admin,setAdmin] = useState<string>();
    const [hintedCards,setHintedCards] = useState<string[]>([]);
    const socket = useSocket();
    const [tries,setTries] = useState<Number>(0);
    const [playersBtn,setPlayersBtn] = useState<boolean>(false);
    const [playerSettingsBtn,setPlayerSettingsBtn] = useState<boolean>(false);
    const [namechangeInput,setNameChangeInput] = useState<string>("");
    const fetchingGame = async () => {
        const response = await fetch(`https://codenames-backend-rgry.onrender.com/${gameID}`, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
            },
        });
            const json = await response.json();
            setGame(json.game);
      }
    useEffect(()=>{        
        if (localStorage.getItem('game')!=null) {
            const listString = localStorage.getItem('game');
            const list:localStorageInterface[] = listString ? JSON.parse(listString) : [];

            const gameObj:localStorageInterface|undefined = list.find(obj => obj.gameid === gameID);
            if (gameObj) {
               setName(gameObj.name);
               setNameChangeInput(gameObj.name);
               fetchingGame();
               socket?.emit('join-game',gameObj.name,gameID);
            }
            else{
                navigate(`/join/${gameID}`);
            }     
        }
        else{
            navigate(`/join/${gameID}`);
        }
        
    },[])
    useEffect(()=>{
        if (game) {
            setBluePlayers(game.blueTeam.players);
            setRedPlayers(game.redTeam.players);
            setRevealedCards(game.revealedCards);
            setBlueCardsLeft(game.blueTeam.cardsLeft);
            setRedCardsLeft(game.redTeam.cardsLeft);
            setCurrentTeam(game.curretTeam);
            setGameLog(game.game_log);
            setTries(game.tries);
            setAdmin(game.admin);
            let existingplayer = game.blueTeam.players.find(p=>p.name===name);
            if (existingplayer === undefined) {
                existingplayer = game.redTeam.players.find(p=>p.name===name);
            }
            if (existingplayer != undefined) {
                setPlayer(existingplayer);
                setTeam(existingplayer.team);
                socket?.emit('join-team',name,existingplayer.team,existingplayer.role,gameID);
            }
            setCurrentTeam(game.startTeam);
            setGivenClue(game.currentClue != undefined);
            setClue(game.currentClue);
            console.log(game);
        }
        
    },[game]);
    socket?.on('userLeft',(user)=>{
        setBluePlayers(bluePlayers.filter(pl=>pl.name!=user));
        setRedPlayers(redPlayers.filter(pl=>pl.name!=user));
    });
    const joinTeam = (color:"blue"|"red", role:"operative"|"spymaster")=>{
        setTeam(color);
        if (color ==="blue") {
            setBluePlayers([...bluePlayers,{name:name!,role:role}]);
        }else{
            setRedPlayers([...redPlayers,{name:name!,role:role}]);
        }
        setPlayer({
            name:name!,
            role:role,
            team:color,
        })
        socket?.emit('join-team',name,color,role,gameID);
    }
    socket?.on('team-join',(name:string,color:"red"|"blue",role:"spymaster"|"operative")=>{
        const newPlayer = {
            name:name,
            role:role,
            team:color,
        }
        if (color==="blue") {
            !bluePlayers.includes(newPlayer) && setBluePlayers([...bluePlayers,newPlayer]);
        }
        else{
            !redPlayers.includes(newPlayer) && setRedPlayers([...redPlayers,newPlayer]);
        }
    })
    const clueHandler = (text:string,number:Number)=>{
        setGivenClue(true);
        setClue({
            text:text,
            number:number,
        });
        const log:LogInterface = {
            text:`${text} ${number}`,
            player:player!,
        }
        socket?.emit('clue',player,{text:text,number:number},log,gameID);
        
        addLog(log);
        
    }
    socket?.on('get-clue',(player:PlayerInterface,getclue:ClueInterface)=>{
        setGivenClue(true);
        setClue({
            text:getclue.text,
            number:getclue.number,
        });
        const log:LogInterface = {
            text:`${getclue?.text} ${getclue?.number}`,
            player:player,
        }
        addLog(log);
    })
    useEffect(()=>{
        if (blueCardsLeft === 0 || redCardsLeft === 0) {
            gameOver()
        }
        if (name && !team) {
            const bluePlayer = bluePlayers.find(p=>p.name===name);
            const redPlayer = redPlayers.find(p=>p.name===name);
            if(bluePlayer) {
                setPlayer(bluePlayer);
                setTeam("blue");
            }
            if(redPlayer){
                setPlayer(redPlayer);
                setTeam("red");
            }
        }
    },[blueCardsLeft,redCardsLeft])
    const guess = (event: React.BaseSyntheticEvent) => {
        const color = event.currentTarget.getAttribute('data-color');
        const key = event.currentTarget.getAttribute('data-key');
        socket?.emit('guess',player,color,key,blueCardsLeft,redCardsLeft,tries,clue?.number,gameID);
        if (color === currentTeam) {
            currentTeam==="blue"?setBlueCardsLeft(Number(blueCardsLeft)-1):setRedCardsLeft(Number(redCardsLeft)-1);
            if (Number(clue?.number)-Number(tries)>0) {
                setTries(Number(tries)+1);
            }else{
                setCurrentTeam(currentTeam==="blue"?"red":"blue");
                setHintedCards([]);
                setGivenClue(false);
                setClue(undefined);
                setTries(0);
            } 
               
        }else if(color ==="blue" || color === "red"){
            if (currentTeam === "red") {
                if (Number(blueCardsLeft)>1) {
                    setBlueCardsLeft(Number(blueCardsLeft)-1);
                }else{
                    setCurrentTeam("blue");
                }

            }else{
                if (Number(redCardsLeft)>1) {
                    setRedCardsLeft(Number(redCardsLeft)-1);
                }
                else{
                    setCurrentTeam("red");
                }
            }
            
            setCurrentTeam(currentTeam==="blue"?"red":"blue");
            setHintedCards([]);
            setGivenClue(false);
            setClue(undefined);
            setTries(0);
        }
        else if (color === "black"){
            gameOver();
        }else{
            setGrayCards(Number(grayCards)-1);
            setCurrentTeam(currentTeam==="blue"?"red":"blue");
            setHintedCards([]);
            setGivenClue(false);
            setClue(undefined);
            setTries(0);
        }
    };
    socket?.on('get-guess',(guessPlayer:PlayerInterface,correct:boolean,blue_red:boolean,key:string,newBlueCardsLeft:Number,newRedCardsLeft:Number,grayCard:boolean,newTries:number,newcurrentTeam:"blue"|"red")=>{
        reveal(key);
        if (clue) {
            if (correct) {
                setBlueCardsLeft(Number(newBlueCardsLeft));
                setRedCardsLeft(Number(newRedCardsLeft));
                setTries(newTries);
                if (currentTeam != newcurrentTeam) {
                    setCurrentTeam(currentTeam==="blue"?"red":"blue");
                    setHintedCards([]);
                    setGivenClue(false);
                    setClue(undefined);
                    setTries(0);
                }
            }else if(blue_red){
                setBlueCardsLeft(newBlueCardsLeft);
                setRedCardsLeft(newRedCardsLeft);
                setCurrentTeam(guessPlayer.team==="blue"?"red":"blue");
                setHintedCards([]);
                setGivenClue(false);
                setClue(undefined);
                setTries(0);
            }
            else if (grayCard){
                setGrayCards(Number(grayCards)-1);
                setCurrentTeam(currentTeam==="blue"?"red":"blue");
                setHintedCards([]);
                setGivenClue(false);
                setClue(undefined);
                setTries(0);
                
            }else{
                gameOver(); 
            }  
        }
    })
    const clickOnCard = (event:React.BaseSyntheticEvent)=>{
        
        const key = event.target.getAttribute('data-key');
        if (hintedCards) {
            if (hintedCards.includes(key)) {
                
                setHintedCards(hintedCards.filter(card=>card != key));
            }else{
                setHintedCards([...hintedCards, key]);
            }
        }else{
            setHintedCards(new Array(key));
        }
        socket?.emit('hint',player,key,gameID);
    }
    socket?.on('get-hint',(key)=>{
        if (hintedCards) {
            if (hintedCards.includes(key)) {
                setHintedCards(hintedCards.filter(card=>card != key));
            }else{
                setHintedCards([...hintedCards, key]);
            }
        }else{
            setHintedCards(new Array(key));
        }
    })
    const addLog = (log: LogInterface) => {
        if (gameLog) {
            setGameLog([...gameLog, log]);
        }else{
            setGameLog(new Array(log));
        }
      };
    const reveal = (key:string)=>{
        if (revealedCards) {
            setRevealedCards([...revealedCards, key]);
        }else{
            setRevealedCards(new Array(key));
        }
    }
    const endGuessing = ()=>{
        setCurrentTeam(currentTeam==="blue"?"red":"blue");
        setGivenClue(false);
        setClue(undefined);
        setTries(0);
        socket?.emit('end-guessing',gameID);
    }
    socket?.on('end-guess',()=>{
        setCurrentTeam(currentTeam==="blue"?"red":"blue");
        setGivenClue(false);
        setClue(undefined);
        setTries(0);
    })
    const gameOver = ()=>{
        if (blueCardsLeft === 0) {
            setWinner("blue");
        }
        else if(redCardsLeft === 0){
            setWinner("red");
        }
        else{
            setWinner(currentTeam==="blue"?"red":"blue");
        }
    }
    const newGame = async ()=>{
        
        const response = await fetch("https://codenames-backend-rgry.onrender.com/createRoom",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
                },
            body:JSON.stringify({
                name:name,
                cards:game?.cards,
            })
        })
        const json = await response.json();
        const newGameId = json.roomid;
        const gameObj = {gameid:newGameId,name:name};
            
        addObjectToList(gameObj);
        socket?.emit('newGame',newGameId,gameID);
        socket?.emit('join-game',name,newGameId);
        navigate(`/game/${newGameId}`);
        window.location.reload();
    }
    function addObjectToList(newObject:Object) {
        // Retrieve the existing list from localStorage
        const existingListString = localStorage.getItem('game');
        const existingList = existingListString ? JSON.parse(existingListString) : [];
      
        // Add the new object to the list
        existingList.push(newObject);
      
        // Store the updated list back in localStorage
        localStorage.setItem('game', JSON.stringify(existingList));
      }
    socket?.on('new-game',(newGameId)=>{
        if (name) {
            const gameObj = {
                gameid:newGameId,
                name:name
            };         
            addObjectToList(gameObj);
            socket?.emit('join-game',gameObj.name,newGameId);
            navigate(`/game/${newGameId}`);
            window.location.reload(); 
        }
        
    });
    const clickOnPlayersBtn = ()=>{
        setPlayersBtn(!playersBtn);
    }
    const clickOnPlayerSettingsBtn = ()=>{
        setPlayerSettingsBtn(!playerSettingsBtn);
    }
    const copyInvitationLink = ()=>{
        navigator.clipboard.writeText(`https://codenames-backend-rgry.onrender.com/game/${gameID}`);
    }
    const changeNickname = ()=>{
        if (namechangeInput != "" && namechangeInput != name) {
            if (game?.players.find(p=>p.name===namechangeInput) === undefined) {
                if (player) {
                    const newPlayer = player;
                    newPlayer.name = namechangeInput;
                    setPlayer(newPlayer);
                    const newBluePlayers:PlayerInterface[] = bluePlayers.filter(p=>p.name!=name);
                    const newRedPlayers:PlayerInterface[] = redPlayers.filter(p=>p.name!=name);
                    
                    if (player.team === "red") {   
                        //newRedPlayers.push(newPlayer);
                        setRedPlayers(newRedPlayers);
                    }else{          
                        //newBluePlayers.push(newPlayer);
                        setRedPlayers(newBluePlayers);
                    }
                }
                if (admin === name) {
                    setAdmin(namechangeInput);
                }
                setName(namechangeInput);

                const listString = localStorage.getItem('game');
                let list:localStorageInterface[] = listString ? JSON.parse(listString) : [];
                const gameObj:localStorageInterface|undefined = list.find(obj => obj.gameid === gameID);
                list = list.filter((game)=>game.gameid != gameID);
                
                if (gameObj) {
                    gameObj.name = namechangeInput;
                    list.push(gameObj);
                }
                localStorage.setItem('game', JSON.stringify(list));
                
                socket?.emit('name-change',name,namechangeInput,gameID);
                
            }  
        }
        setPlayerSettingsBtn(false);  
    }
    socket?.on('name-changed',(oldName,newName)=>{
        if (admin === oldName) {
            setAdmin(newName);
        }
        const bluePlayer = bluePlayers.find(p=>p.name===oldName);
        const redPlayer = redPlayers.find(p=>p.name===oldName);
        const newRedPlayers:PlayerInterface[] = redPlayers.filter(p=>p.name!=oldName);
        const newBluePlayers:PlayerInterface[] = bluePlayers.filter(p=>p.name!=oldName);
        if (bluePlayer) {
            bluePlayer.name = newName;
            newBluePlayers.push(bluePlayer);
            setRedPlayers(newBluePlayers);
            
        }else if(redPlayer){   
            redPlayer.name = newName;
            newRedPlayers.push(redPlayer);
            setRedPlayers(newRedPlayers);
            console.log(newRedPlayers);
        }
    });
    const changeTeam = ()=>{
        if (player) {
            if (player.team === "red") {
                setRedPlayers(redPlayers.filter(p=>p.name != name));
            }else{
                setBluePlayers(bluePlayers.filter(p=>p.name != name));
            }
            socket?.emit('leave-team',name,team,gameID);
            setTeam(null);
            setPlayer(undefined);          
        }
    }
    socket?.on('left-team',(leftName,team)=>{
        if (team==="blue") {
            setBluePlayers(bluePlayers.filter(p=>p.name!=leftName));
        }else{
            setRedPlayers(redPlayers.filter(p=>p.name!=leftName));
        }
    })
    if (!game || !revealedCards){
        return(
            <div className="flex justify-center items-center text-6xl">
                "sorry"
            </div>
        )
    } 
    else{
       return (
        <div className={` h-dvh w-dvw bg-gradient-to-br ${currentTeam==="blue"?" from-cyan-800 to-cyan-700":" from-rose-800 to-rose-700"} max-h-screen`}>
            <div className=" h-1/12 flex flex-row justify-between mx-20">
                <div className=" w-1/6 flex flex-col items-center">
                    <button className={`capitalize bg-yellow-400 rounded-2xl text-center flex p-4 m-2 gap-2 items-center`} onClick={clickOnPlayersBtn}>Players <img className=" w-4" src="/images/icons/icon_player.png" alt="" /> <span>{game.players.length}</span></button>
                    <div className={` relative bg-white opacity-95 p-3 ${playersBtn?"visible":"hidden"} w-full rounded-md flex flex-col gap-2 items-center`}>
                        <div>Players in this room:</div>
                        <div>
                            {
                                game.players && game.players.map(p=>(
                                    <Player player={p} />
                                ))
                            }
                        </div>
                        <button className={` w-2/3 capitalize bg-yellow-400 rounded-2xl text-center p-2 text-lg ${team?"visible":"hidden"}`} onClick={copyInvitationLink}>Copy Invitation Link</button>
                    
                    </div>
                </div>

                <div className="w-1/6 flex flex-col items-center">
                    <button className={`capitalize bg-yellow-400 rounded-2xl text-center flex p-4 m-2 gap-2 items-center`} onClick={clickOnPlayerSettingsBtn}>{name} <img className=" w-4" src="/images/icons/icon_player.png" alt="" /> <span>{game.players.length}</span></button>
                    <div className={` relative bg-white opacity-95 p-3 ${playerSettingsBtn?"visible":"hidden"} w-full rounded-md flex flex-col  gap-2 justify-center items-center`}>
                        <div>Nickname</div>
                        <input className=" rounded-md ring-1 ring-black w-3/4 p-1" type="text" name="" id="" onChange={(event)=>setNameChangeInput(event.target.value)} />
                        <button className=" w-2/3 capitalize bg-yellow-400 rounded-2xl text-center p-2 text-md" onClick={changeNickname}>Change Nickname</button>
                        <button className=" w-2/3 capitalize bg-yellow-400 rounded-2xl text-center p-2 text-md" onClick={changeTeam}>Change Team/Role</button>
                    
                    </div>
                </div>
                
                
            </div>
            <div className="w-full h-11/12 flex flex-row gap-5 -mt-4">
                <div className="w-1/4 h-full">
                    <TeamCard color="red" cardsLeft={redCardsLeft} isInTeam={team!=null} join={joinTeam} team={redPlayers} />
                    <div></div>
                </div>
                
                <div className="flex flex-col w-1/2 h-full items-center justify-start -mt-10">
                    <div key={"cards"} className="flex flex-row flex-wrap justify-between aspect-square h-11/12">
                        {
                            game?.cards.map(card=>(
                                <Card color={card.team} img={card.img} currentTeam={currentTeam!} givenClue={givenClue!} guess={guess} player={player!} cardsLeft={currentTeam==="blue"?blueCardsLeft:redCardsLeft} grayCards={grayCards} revealed={revealedCards.includes(card.img)} hint={clickOnCard} hinted={hintedCards.includes(card.img)} />
                            ))
                            
                        }
                    </div>
                    {
                        givenClue?
                        <div key={"clue"} className="flex flex-col h-1/12">
                            <div className={` flex flex-row m-4 p-2 gap-4 items-center uppercase justify-center text-3xl bg-white font-bold ring-2 ring-black rounded-xl`}>
                            {clue?.text +" " + clue?.number}
                            </div>
                            <button className={`p-2 w-2/3 self-center bg-yellow-300 font-medium text-sm rounded-xl h-1/2 ${(player?.role === "operative" && player?.team === currentTeam)?"visible":"hidden"}`} onClick={endGuessing}>End guessing</button>
                        </div>
                        :
                        (player?.team === currentTeam && player?.role ==="spymaster")?
                            <ClueInput key={"clueInput"} giveClue={clueHandler} />:
                            <div key={"waiting"} className="flex flex-row w-3/4 p-2 gap-4 h-1/12 items-center justify-center text-xl font-thin">
                                Waiting for clue
                            </div>
                    }
                </div>
                
                <div className=" w-1/4 h-full">
                    <TeamCard color="blue" cardsLeft={blueCardsLeft} isInTeam={team!=null} join={joinTeam} team={bluePlayers} />
                    <div className="bg-white h-1/2 rounded-lg w-3/4 mx-16  flex flex-col opacity-75">
                        <div className=" place-self-center scroll-m-0 overflow-auto flex flex-col gap-4">Game Log</div>
                        {
                            gameLog && gameLog.map(log=>(
                                <Log key={log.text} message={log.text} player={log.player} />
                            ))
                        }
                    </div>
                </div>
                <div className={`${winner != undefined?"visible":"hidden"} rounded-2xl bg-white ring-8 ring-${winner}-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold uppercase text-center w-1/4`}>
                    <div>
                        {winner} team is the winner!
                    </div>
                    <button className={`p-2 w-2/3 self-center bg-yellow-300 font-medium text-sm rounded-xl h-1/2 ${name===admin?"visible":"hidden "}`} onClick={newGame}>New Game</button>
                </div>
            </div>
        </div>
    ) 
    }
    
}

export default Game