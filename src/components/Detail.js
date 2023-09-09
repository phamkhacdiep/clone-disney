import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useDispatch} from "react-redux"
import styled from "styled-components";
import db from "../firebase";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import {addToFavorites} from '../app/action'
import { useHistory } from 'react-router-dom';
import {Link} from "react-router-dom"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Alert, Stack } from '@mui/material';
export default function Detail({ favoriteMovies }) {
    const { id } = useParams();
    const [detailData, setDetailData] = useState({});
    const dispatch = useDispatch();
    const history = useHistory();
    const [showTrailer, setShowTrailer] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMovieAdded, setIsMovieAdded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
 
  useEffect(() => {
    db.collection("movies")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setDetailData(doc.data());
        } else {
          console.log("no such document in firebase 🔥");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [id]);
const handleAddToFavorites = (movie) => {
  const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  const isMovieInFavorites = favoriteMovies.some(
    (favoriteMovie) => favoriteMovie.title === movie.title
  );

  if (isMovieInFavorites) {
    setShowAlert(true);
    setIsMovieAdded(true);
  } else {
    dispatch(addToFavorites(movie));
    setIsMovieAdded(false);
    setShowAlert(false);
    
    const updatedMoviesAdd = [...favoriteMovies, movie];
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedMoviesAdd));
  }

  history.push('/favorite'); // Chuyển hướng sang trang Favorite
};

  const handleTrailer = () => {
    setShowTrailer(true);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);

  };

  

  return (
    <Container>
      <Stack sx={{ width: '100%' }} spacing={2}>
        {showAlert && (
          <Alert variant="outlined" severity="warning">
            Phim này đã có trong danh sách yêu thích.
          </Alert>
        )}
      </Stack>
      <Link to="/home">
        <ArrowLeftIcon style={{paddingTop: '5px'}}/>
        <span>Back to Home</span>
      </Link>
      <Background>
        <img alt={detailData.title} src={detailData.backgroundImg} />
      </Background>

      <ImageTitle>
        <img alt={detailData.title} src={detailData.titleImg} />
      </ImageTitle>
      <ContentMeta>
        <Controls>
          <Player>
            {isPlaying ? (
              <MovieContainer>
                <video controls autoPlay>
                <source src={detailData.playMovie} type="video/mp4" />
              </video>
              
              </MovieContainer>
            ) : (
              <>
                <PlayArrowIcon onClick={handlePlay} />
                <span>Play</span>
              </>
            )}
          </Player>
          <Trailer onClick={handleTrailer}>
            <PlayArrowIcon />
            <span>Trailer</span>
          </Trailer>
          <AddFavorites onClick={() => handleAddToFavorites(detailData)}>
            <AddIcon />
            <span>Add to favorites</span>
          </AddFavorites>
        </Controls>
        <SubTitle>{detailData.subTitle}</SubTitle>
        <Description>{detailData.description}</Description>
      </ContentMeta>
      {showTrailer && (
        
        <VideoContainer>
          <video controls autoPlay>
            <source src={detailData.trailerUrl} type="video/mp4" />
          </video>
          <button onClick={handleCloseTrailer}>X</button>
        </VideoContainer>

        
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: calc(100vh-250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`;

const Background = styled.div`
  left: 0px;
  opacity: 0.8;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: -1;

  img {
    width: 100vw;
    height: 100vh;

    @media (max-width: 768px) {
      width: initial;
    }
  }
`;

const ImageTitle = styled.div`
  align-items: flex-end;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  margin: 0px auto;
  height: 30vw;
  min-height: 170px;
  padding-bottom: 24px;
  width: 100%;

  img {
    max-width: 600px;
    min-width: 200px;
    width: 35vw;
  }
`;

const ContentMeta = styled.div`
  max-width: 874px;
`;

const Controls = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 24px 0px;
  min-height: 56px;
`;

const Player = styled.button`
  font-size: 15px;
  margin: 0px 22px 0px 0px;
  padding: 0px 24px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  background: rgb (249, 249, 249);
  border: none;
  color: rgb(205 38 38);

  &:hover {
    background: rgb(198, 198, 198);
  }

`;

const Trailer = styled(Player)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgb(249, 249, 249);
  color: rgb(205 38 38);
`;


const SubTitle = styled.div`
  color: rgb(249, 249, 249);
  font-size: 15px;
  min-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const Description = styled.div`
  line-height: 1.4;
  font-size: 20px;
  padding: 16px 0px;
  color: rgb(249, 249, 249);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const AddFavorites = styled.button`
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1.8px;
  text-align: center;
  text-transform: uppercase;
  border: none;
  color: rgb(205 38 38);

  &:hover {
    background: rgb(198, 198, 198);
  }
`

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  video {
    max-width: 100%;
    max-height: 100%;
  }

  button {
    margin-bottom: 40%;
  }
`;

const MovieContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  video {
    max-width: 100%;
    max-height: 100%;
  }

`

