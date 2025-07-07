import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts().then((res) => {
      if (res && res.documents) {
        setPosts(res.documents);
      }
    });
  }, []);

  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
          {posts.map((post) => (
            <div key={post.$id} className='p-2 w-1/4'>
              <PostCard
                $id={post.$id}
                Title_01={post.Title_01}
                FeaturedImage_03={post.FeaturedImage_03}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;







