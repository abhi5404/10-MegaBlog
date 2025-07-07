import React from 'react';
import appwriteService from '../appwrite/config';
import { Link } from 'react-router-dom';

function PostCard({ $id, Title_01, FeaturedImage_03 }) {
  let imageUrl = "https://via.placeholder.com/400x250?text=Image+Not+Found";

  try {
    if (FeaturedImage_03) {
      imageUrl = appwriteService.getFilePreview(FeaturedImage_03);
      console.log("🧪 Preview URL:", imageUrl);
    }
  } catch (e) {
    console.error("Image preview error:", e);
  }

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4 hover:shadow-xl transition-shadow duration-300">
        <div className="w-full justify-center mb-4">
          <img
            src={imageUrl}
            alt={Title_01}
            className="rounded-xl w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400x250?text=Image+Not+Found";
            }}
          />
        </div>
        <h2 className="text-xl font-bold text-center">{Title_01}</h2>
      </div>
    </Link>
  );
}

export default PostCard;








