import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { API_URL } from "../config/api";
import { socket } from "../socket/socket";

const AllImages = () => {
  const [images, setImages] = useState([]);


  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/images`);
      const data = await res.json();

      if (data.success) {
        setImages(data.images);
      }

    } catch (error) {
      console.error("Failed to load images:", error);
    }
  };



  useEffect(() => {

    fetchImages();


    socket.on("new-images", () => {
      fetchImages();
    });


    return () => {
      socket.off("new-images");
    };

  }, []);



  const handleImageClick = (image) => {

    socket.emit("select-image", {
      imageId: image.id,
    });

  };



  return (
    <div className="min-h-screen bg-[#E5E5E5] p-6">

      <div className="max-w-7xl mx-auto">


        {
          images.length === 0

          ?

          (
            <div className="flex flex-col items-center justify-center h-screen text-gray-400">

              <ImageIcon className="w-20 h-20 mb-4 opacity-30" />

              <p className="text-lg">
                No images uploaded yet
              </p>

            </div>
          )


          :

          (

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">

              {
                images.map((img) => (

                  <div
                    key={img.id}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleImageClick(img)}
                  >


                    <img
                      src={`${API_URL}/images/data/${img.id}`}
                      alt={img.original_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />


                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">

                      <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
                        Click to Show
                      </span>

                    </div>


                  </div>

                ))
              }

            </div>

          )

        }


      </div>

    </div>
  );
};


export default AllImages;