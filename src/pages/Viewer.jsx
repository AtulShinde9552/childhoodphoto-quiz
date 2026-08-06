import {useEffect,useState} from "react";
import {socket} from "../socket/socket";


const Viewer=()=>{


const [image,setImage]=useState(null);
const [showName,setShowName]=useState(false);



useEffect(()=>{


socket.on(
"image-update",
(data)=>{


console.log(
"received",
data
);


setImage(data);

setShowName(false);


}

);



return()=>{

socket.off(
"image-update"
);

}


},[]);





return(

<div className="min-h-screen flex items-center justify-center">


{

image?

<div className="flex gap-10">


<img

src={image.url}

className="h-[70vh] object-contain"

/>



<div className="flex items-center">


{

showName?

<h1 className="text-6xl text-orange-500 font-bold">

{
image.name
}

</h1>


:

<button

onClick={()=>setShowName(true)}

className="border-4 border-orange-500 p-5 rounded-xl text-2xl"

>

Reveal Answer

</button>


}


</div>



</div>


:

<h2>
Waiting for HR selection...
</h2>


}



</div>


);


};


export default Viewer;