import React, { useState, useEffect } from 'react';
import db  from '../firebase';
import {styled} from "styled-components"
import {Link} from "react-router-dom"
export default function AllMovie() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesRef = db.collection('movies');
        const snapshot = await moviesRef.get();
        const moviesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <Container>
      <h1>All Movies</h1>
      <Content>
        {movies.map((movie) => (
          <Wrap>
            <h3>{movie.title}</h3>
            <Link to={`/detail/` + movie.id}>
            <img src={movie.cardImg} alt={movie.title} />
            </Link>
            </Wrap>
        ))}
        </Content>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  min-height: calc(100vh - 250px);
  overflow-x: hidden;
  display: block;
  top: 72px;
  padding: 0 calc(3.5vw + 5px);
`
const Content = styled.div`
  display: grid;
  grid-gap: 25px;
  gap: 25px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Wrap = styled.div`
  padding-top: 56.25%;
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
    width: 100%;
    z-index: 1;
    top: 0;
  }
`;

