import React, { FC, useEffect, useState } from "react";
import { IPost } from "../../../Types";
import { Avatar, Box, ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import { collection, onSnapshot } from "firebase/firestore";
import { initialPosts } from "./initialPosts";
import  Card from "../../ui/Card";

interface IPosts {
  posts: IPost[];
}

const Posts: FC = () => {
  const { db } = useAuth();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<IPost[]>(initialPosts);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "posts"),
      (snapshot) => {
        const newPosts: IPost[] = [];
        snapshot.forEach((doc) => {
          newPosts.push(doc.data() as IPost);
        });
        setPosts(newPosts);
      },
      (err) => {
        setError("Error fetching posts: " + err.message);
      }
    );

    return () => {
      unsub();
    };
  }, [db]);

  return (
    <>
      {posts.map((post, idx) => (
        <Card 
        key={`Post-${idx}`}>
          <Link
            to={`/profile/${post.author.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#111",
              marginBottom: 12,
            }}
          >
            <Box
              sx={{
                position: "relative",
                marginRight: 2,
                width: 50,
                height: 50,
              }}
            >
              <Avatar
                src={post.author.avatarSrc}
                alt={post.author.name}
                sx={{ width: 46, height: 46, borderRadius: "50%" }}
              />
            </Box>
            <div>
              <div style={{ fontSize: 14 }}>{post.author.name}</div>
              <div style={{ fontSize: 14, opacity: "0.6" }}>
                {post.createdAt}
              </div>
            </div>
          </Link>
          <p>{post.content}</p>
          {post?.images?.length && (
            <ImageList variant="masonry" cols={3} gap={8}>
              {post.images.map((image, index) => (
                <ImageListItem key={index}>
                  <img src={image} alt={""} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Card>
      ))}
    </>
  );
};

export default Posts;
