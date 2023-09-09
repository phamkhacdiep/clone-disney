import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import {Link} from "react-router-dom"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import DeleteIcon from '@mui/icons-material/Delete';
export default function Favorite() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
 
    const storedFavoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies'));
    
    if (storedFavoriteMovies) {
      setFavoriteMovies(storedFavoriteMovies);
    }
  }, []);

  const handleRemoveFavorite = (movieTitle) => {
    const updatedFavoriteMovies = favoriteMovies.filter(movie => movie.title !== movieTitle);
    setFavoriteMovies(updatedFavoriteMovies);
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavoriteMovies));
  };


  return (
    <div>
      <Container>
      <h1>Favorite Movies</h1>
      <Link to="/home"> <ArrowLeftIcon style={{paddingTop: '5px'}}/><span>Back to Home</span></Link>
      {favoriteMovies.length === 0 ?  (
    
        <p>No favorite movies yet.</p>
       
        
      ) : (
        <Content>
         {favoriteMovies.map((movie) => (
            <Wrap key={movie}>
                <img src={movie.cardImg} alt='' />
                <h4>{movie.title}</h4>
                <button onClick={() => handleRemoveFavorite(movie.title)}>
                <DeleteIcon/>
                </button>
                <p style={{paddingLeft: "100px", marginTop: "-40px"}}>Delete movies you don't like</p>
            </Wrap>
            ))}
        </Content>
      )}
      </Container>
    </div>
  );
}


const Container = styled.div`
    margin-top: 100px;
    padding-left: 50px;
`

const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding-top: 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  padding-top: 50%;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  border: 3px solid rgba(249, 249, 249, 0.1);
  img {
    inset: 0px;
    display: block;
    object-fit: cover;
    opacity: 1;
    position: absolute;
    transition: opacity 500ms ease-in-out 0s;
    width: 100%;
    z-index: 1;
    top: 0;
  }

  button {
  font-size: 12px;
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
  border: none;
  color: rgb(205 38 38);


  p{
    padding-left: 100px;
    margin-top: -40px;
  }

  &:hover {
    background: rgb(198, 198, 198);
  }
  }
`;



