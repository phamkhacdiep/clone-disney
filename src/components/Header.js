import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import  { auth, provider } from "../firebase";
import { selectUserName, selectUserPhoto, setUserLoginDetails, setSignOutState} from "../feature/user/userSlice";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MovieIcon from '@mui/icons-material/Movie';
import {Link} from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import db from "../firebase";
export default function Header() {
    const dispatch = useDispatch();
    const history = useHistory();
    const userName = useSelector(selectUserName);
    const userPhoto = useSelector(selectUserPhoto);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [movies, setMovies] = useState([]);
    
    useEffect(() => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user);
          history.push("/home");
        }
      });
    }, [userName]);

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
  

  
    const handleAuth = () => {
      if (!userName) {
        auth
          .signInWithPopup(provider)
          .then((result) => {
            setUser(result.user);
          })
          .catch((error) => {
            alert(error.message);
          });
      } else if (userName) {
        auth
          .signOut()
          .then(() => {
            dispatch(setSignOutState());
            history.push("/");
          })
          .catch((err) => alert(err.message));
      }
    };
  
    const setUser = (user) => {
      dispatch(
        setUserLoginDetails({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );
    };

    const handleSearch = async () => {
      const searchTermValue = searchTerm;
    
      try {
        const snapshot = await db.collection("movies").get();
    
        const movies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const filteredMovies = movies.filter((movie) =>
          movie.title.toLowerCase().startsWith(searchTermValue.toLowerCase())
        );
        setSearchResults(filteredMovies);
    
        console.log("filteredMovies:", filteredMovies); 
    
        if (filteredMovies.length > 0) {
          const firstMovie = filteredMovies[0];
          history.push(`/detail/${firstMovie.id}`);
        } else {
          history.push("/noresults"); 
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm phim:", error);
      }
      setSearchTerm("");
      setSearchResults([]);
    };


    return (
      <Nav>
        <Logo>
          <img src="/images/logo.svg" alt="Disney+" />
        </Logo>
  
        {!userName ? (
          <Login onClick={handleAuth}>Login</Login> 
        ) : (
          <>
            <NavMenu>
              <Link to='./home'>
              <HomeIcon />
              <span>HOME</span>
              </Link>
              <Link to="/favorite">
                <FavoriteIcon />
                <span>FAVORITE</span>
              </Link>
              <Link to="/allmovie">
                <MovieIcon />
                <span>ALL MOVIE</span>
              </Link>
            </NavMenu>
            <SearchMove>
              <input
                type="text"
                placeholder="Search Name Movie"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={handleSearch}>
                <SearchIcon />
              </button>
            </SearchMove>
            {searchResults.length > 0 && (
              <SearchResultsContainer>
                <ResultsList>
                  {searchResults.map((movie) => (
                    <ResultItem key={movie.id}>
                      <Link to={`/detail/${movie.id}`}>
                        {/* {movie.cardImg && <ResultImage src={movie.cardImg} />}
                        {movie.title && <ResultsTitle>{movie.title}</ResultsTitle>} */}
                      </Link>
                     
                    </ResultItem>
                  ))}
                </ResultsList>
              </SearchResultsContainer>
            )}
            <SignOut>
              <UserImg src={userPhoto} alt={userName} />
              <DropDown>
                <span onClick={handleAuth}>Sign out</span>
              </DropDown>
            </SignOut>
          </>
        )}

      </Nav>
      
    );
}

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: #090b13;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 3;
`;

const Logo = styled.a`
  padding: 0;
  width: 80px;
  margin-top: 4px;
  max-height: 70px;
  font-size: 0;
  display: inline-block;

  img {
    display: block;
    width: 100%;
  }
`;

const NavMenu = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  justify-content: flex-end;
  margin: 0px;
  padding: 0px;
  position: relative;
  margin-right: auto;
  margin-left: 25px;

  a {
    display: flex;
    align-items: center;
    padding: 0 12px;


    span {
      color: rgb(205 38 38);
      font-size: 13px;
      letter-spacing: 1.42px;
      line-height: 1.08;
      padding: 2px 5px;
      white-space: nowrap;
      position: relative;

      &:before {
        background-color: rgb(205 38 38);
        border-radius: 0px 0px 4px 4px;
        bottom: -6px;
        content: "";
        height: 2px;
        left: 0px;
        opacity: 0;
        position: absolute;
        right: 0px;
        transform-origin: left center;
        transform: scaleX(0);
        transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
        visibility: hidden;
        width: auto;
      }
    }

    &:hover {
      span:before {
        transform: scaleX(1);
        visibility: visible;
        opacity: 1 !important;
      }
    }
  }
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 3px 3px;
  letter-spacing: 1.5px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  cursor: pointer;
  color: rgb(205 38 38);

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: transparent;
  }
`;

const UserImg = styled.img`
  height: 100%;
`;

const DropDown = styled.div`
  position: absolute;
  top: 60px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 14px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: rgb(205 38 38);

  ${UserImg} {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  &:hover {
    ${DropDown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;
const SearchMove = styled.div`
  display: flex;
  align-items: center;
  margin-right: 55%;
  
  input {
    padding: 5px;
    border: none;
    font-size: 15px;
    width: 250px;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button {
    background-color: #f9f9f9;
    border: none;
    border-radius: -2px;
    padding: 0px;
    margin-left: 0px;
    cursor: pointer;
    outline: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SearchResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultsList = styled.ul`   
`;

const ResultItem = styled.li`
`;