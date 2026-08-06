import { useState, useEffect } from "react";
import { Upload, X, AlertCircle, Loader2 } from "lucide-react";
import { API_URL } from "../config/api";
import { socket } from "../socket/socket";

const HRUpload = () => {

  const [images,setImages] = useState([]);
  const [staged,setStaged] = useState([]);
  const [error,setError] = useState("");
  const [isDragging,setIsDragging]=useState(false);
  const [uploading,setUploading]=useState(false);


  // load images from backend
  const fetchImages = async()=>{

    try{

      const res = await fetch(`${API_URL}/images`);
      const data = await res.json();

      if(data.success){
        setImages(data.images);
      }

    }catch(err){
      console.log(err);
      setError("Failed to load images");
    }

  };


  useEffect(()=>{

    fetchImages();


    socket.on("new-images",()=>{
      fetchImages();
    });


    return()=>{
      socket.off("new-images");
    }


  },[]);



  const addFiles=(files)=>{

    setError("");

    const invalid=files.filter(
      file=>!file.type.startsWith("image/")
    );

    if(invalid.length){
      setError("Only images allowed");
      return;
    }


    const preview=files.map(file=>({

      id:Date.now()+Math.random(),
      file,
      url:URL.createObjectURL(file),
      name:file.name

    }));


    setStaged(prev=>[
      ...prev,
      ...preview
    ]);

  };



  const handleUpload=async()=>{

    if(!staged.length){
      setError("Select images first");
      return;
    }


    setUploading(true);


    try{


      const formData=new FormData();


      staged.forEach(img=>{
        formData.append(
          "images",
          img.file
        );
      });



      const res=await fetch(
        `${API_URL}/upload`,
        {
          method:"POST",
          body:formData
        }
      );


      const data=await res.json();


      if(data.success){

        setStaged([]);

        fetchImages();

      }
      else{

        setError(data.message);

      }


    }
    catch(err){

      console.log(err);
      setError("Upload failed");

    }
    finally{

      setUploading(false);

    }


  };



  const selectImage=(image)=>{


    console.log("sending image",image);


    socket.emit(
      "select-image",
      {
        imageId:image.id
      }
    );


  };



return (

<div className="min-h-screen p-6">


<h1 className="text-3xl font-bold mb-6">
Upload Images
</h1>


{
error &&
<div className="bg-red-100 text-red-600 p-3 rounded mb-4">
<AlertCircle className="inline mr-2"/>
{error}
</div>
}



<div

onDrop={(e)=>{

e.preventDefault();
setIsDragging(false);

addFiles(
Array.from(e.dataTransfer.files)
);

}}

onDragOver={(e)=>{

e.preventDefault();
setIsDragging(true);

}}

className={`
border-2 border-dashed rounded-xl p-10 text-center
${isDragging?"border-orange-500":"border-gray-300"}
`}
>


<input

type="file"
multiple
accept="image/*"

id="upload"

className="hidden"

onChange={(e)=>
addFiles(
Array.from(e.target.files)
)
}

/>


<label
htmlFor="upload"
className="cursor-pointer"
>

<Upload
className="mx-auto mb-3"
/>


Choose Images


</label>


</div>





{
staged.length>0 &&

<div className="mt-5">


<div className="grid grid-cols-5 gap-3">


{
staged.map(img=>(

<div
key={img.id}
className="relative"
>

<img
src={img.url}
className="w-full h-32 object-cover rounded"
/>


<button

onClick={()=>{

setStaged(
staged.filter(
x=>x.id!==img.id
)
)

}}

className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
>

<X size={15}/>

</button>


</div>

))
}


</div>


<button

onClick={handleUpload}

disabled={uploading}

className="mt-5 w-full bg-orange-500 text-white p-3 rounded"

>

{
uploading?

<Loader2 className="animate-spin mx-auto"/>

:

`Upload ${staged.length} Images`

}


</button>


</div>

}






<hr className="my-10"/>



<h2 className="text-xl font-bold mb-4">
All Images
</h2>



<div className="grid grid-cols-6 gap-4">


{
images.map(img=>(


<div

key={img.id}

onClick={()=>selectImage(img)}

className="cursor-pointer hover:scale-105 transition"

>


<img

src={img.url}

className="h-32 w-full object-cover rounded"

/>


</div>


))
}



</div>



</div>


);


};


export default HRUpload;