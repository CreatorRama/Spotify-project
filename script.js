console.log("seeta ram hanuman");
let currentsong=new Audio();
let songs;
let folder;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currfolder=folder;
let a= await fetch(`http://127.0.0.1:5500/${folder}/`);
let response =await a.text();
// console.log(response);
let div=document.createElement("div");
div.innerHTML=response;
// console.log(div);

let anch=div.getElementsByTagName("a");
// console.log(anch);
songs=[];
for (let index = 0; index < anch.length; index++) {
    const element = anch[index];
    // console.log(element);
    
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1]);
    }
    // console.log(songs);
    
}
//display all songs in the list
let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];
// console.log(songul);
songul.innerHTML="";
for(const song of songs){
    // console.log(song);
    
songul.innerHTML=songul.innerHTML+`<li>
<img class="invert" src="img/music.svg" alt="">
<div class="info">
    <div>${song.replaceAll("%20"," ")}</div>
    <div>Ram</div>
</div>
    <div class="playnow">
        <span>PlayNow</span>
        <img class="invert" src="img/play.svg" alt="">
    </div>
</li>`;
}
//attach an eventlistener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
e.addEventListener("click",element=>{

    const infoElement = e.querySelector(".info");
    console.log(infoElement);
    
    if (infoElement.childElementCount > 0) {
        console.log(infoElement.firstElementChild.innerHTML);
        playmusic(infoElement.firstElementChild.innerHTML);
    } else {
        console.log("No child elements found in .info");
        // Handle the case where .info has no child elements
    }
})

})
return songs;
}
const playmusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track);
    // console.log(track);
    currentsong.src=`/${currfolder}/`+track;
    // console.log(currentsong.src);
    if(!pause){
        currentsong.play();
    play.src="img/pause.svg";

    }
    document.querySelector(".songinfo").innerHTML=track;
    document.querySelector(".songtime").innerHTML="00:00/00:00";

}
async function displayalbums(){

    let a= await fetch(`http://127.0.0.1:5500/songs/`);
    // playmusic(songs[0]);
let response =await a.text();
// console.log(response);
let div=document.createElement("div");
div.innerHTML=response;
let anchors=div.getElementsByTagName("a")
// console.log(anchors);
let cardcontainer=document.querySelector(".cardcontainer");
let array=Array.from(anchors);
for (let index = 0; index < array.length; index++) {
    const e= array[index];
    // console.log(e.href);
    if(e.href.includes("/songs/")){
        let folder=(e.href.split("/").slice(-2)[1]);
        // console.log(folder);
        
        let a=await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
        let response=await a.json();
        // playmusic(songs[0]);
        // console.log(response);
        cardcontainer.innerHTML=cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
        <div class="playbutton">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                fill="#000000" height="60px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 60 60"
                xml:space="preserve">
                <g>
                    <path
                        d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z" />
                    <path
                        d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z" />
                </g>
            </svg>
        </div>



        <img src="/songs/${folder}/cover.jpeg" alt="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>

    </div>`
        
    }
    
}
// load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`);
playmusic(songs[0]);  // play the first song of that album whenever card is loaded
    })
})

}
async function main(){
    //get the lists of all songs
    // let play=document.querySelector("#play");
//    songs =await getsongs("songs/ncs"); before
 await getsongs(`/songs/${folder}`);  // we can remove songs from this line because we are not returning songs in getsongs function
 //for finding length of songs in next and previous song to add event listener
//    console.log(sl);
   
    playmusic(songs[0],true);
    // console.log(songs);

    displayalbums();

   //attach an eventlistener to play,next and previous
   play.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        play.src="img/pause.svg";
    }
    else{
        currentsong.pause();
        play.src="img/play.svg";
    }
   })

//    listen for timeupdate event

currentsong.addEventListener("timeupdate",()=>{
    // console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)}:${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
})

// add event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentsong.currentTime=((currentsong.duration)*percent)/100;
    
})
// add an event listener to hambergar for opening left
document.querySelector(".hamburger").addEventListener("click",()=>{
    // console.log(document.querySelector(".left").style.left="0");
    
    document.querySelector(".left").style.left="0";
})
// add an event listener for closing hambergur
document.querySelector(".close").addEventListener("click",()=>{
    // console.log(document.querySelector(".left").style.left="-120%");
    document.querySelector(".left").style.left="-120%";
})
// add an event listener for previous song
document.querySelector("#previous").addEventListener("click",()=>{
console.log("previous song");
let index=songs.indexOf(currentsong.src.split("/").slice(-2)[1]);
let sl=songs.length;
if(index==0){
 playmusic(songs[index+(sl-1)]);
    // index=songs.indexOf(currentsong.src.split("/").slice(-2)[1]);
    // playmusic(songs[index]);
}
else{
    playmusic(songs[index-1]);
}


// if((index-1)<0){
//     playmusic(songs[index-1]);
// }

})
// add an event listener for next song
document.querySelector("#next").addEventListener("click",()=>{
// console.log("next song");
// console.log(currentsong.src.split("/").slice(-2)[1]);
let index=songs.indexOf(currentsong.src.split("/").slice(-2)[1]);
let sl=songs.length;
if(index==sl-1){
    // index=songs.indexOf(currentsong.src.split("/").slice(-2)[1]);
    console.log(playmusic(songs[index-(sl-1)]));
}
else{
    playmusic(songs[index+1]);
}


// if((index+1)< songs.length){
//     playmusic(songs[index+1]);
// }
})
// add an event listener for volume change
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    // console.log(e.target,e.target.value);
    // console.log("current volume is",e.target.value);
    
//    console.log(currentsong.volume=parseInt(e.target.value)/100);
   currentsong.volume=parseInt(e.target.value)/100;
   if(currentsong.volume>0){
    document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
   }
    
})

// // display volume input when touch
// document.querySelector(".volume").addEventListener("click",()=>{
//     document.querySelector(".range").getElementsByTagName("input")[0].style.display="block";
// })

// add an event listener to mute the volume
document.querySelector(".volume>img").addEventListener("click",e=>{
    console.log(e.target);
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg");
        currentsong.volume=0;
        document.querySelector(".range").getElementsByTagName("input")[0].style.display="block";
        document.querySelector(".range").getElementsByTagName("input")[0].value=0;
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg");
        currentsong.volume=0.2;
        document.querySelector(".range").getElementsByTagName("input")[0].value=20

    }
    
})

    
}
main();

      



