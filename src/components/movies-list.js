// useState allows for the the creation of several variables
import React, {useState, useEffect} from 'react';
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

// recieves and uses props
const MoviesList = props => {
    // useState hooks create state variables (blue)
    // 2nd and 3rd lines keep track of what user has entered
    const [movies, setMovies] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");  
    const [searchRating, setSearchRating] = useState("");
    const [ratings, setRatings] = useState(["All Ratings"]);

    // performed after rendering
    useEffect(() => {
        retrieveMovies();
        retrieveRatings();
    },[])

    // retrieve movies
    const retrieveMovies = () => {
        // setCurrentSearchMode("");
        MovieDataService.getAll()
            .then(response => {
                console.log(response.data)
                setMovies(response.data.movies);
                // setCurrentPage(response.data.page);
                // setEntriesPerPage(response.data.entries_per_page);
            })
            .catch(e => {
                console.log(e);
            })
    }

    // retrieve ratings
    const retrieveRatings = () => {
        MovieDataService.getRatings()
        .then(response => {
            console.log(response.data);
            // start with 'All ratings' if user doesn't specify any ratings
            setRatings(["All Ratings"].concat(response.data))
            .catch(e => {
                console.log(e);
            });
        })
    }

    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    }

    const onChangeSearchRating = e => {
        const searchRating = e.target.value;
        setSearchRating(searchRating);
    }

    // call backend API
    const find = (query, by) => {
        MovieDataService.find(query, by)
            .then(response => {
                console.log(response.data);
                setMovies(response.data.movies);
            })
            .catch(e => {
                console.log(e);
            })
    }

    // find movie by title
    const findByTitle = () => {
        // setCurrentSearchMode("findByTitle");
        find(searchTitle, "title")
    }

    // find movie by rating
    const findByRating = () => {
        // setCurrentSearchMode("findByRating");
        if(searchRating === "All Ratings") {
            retrieveMovies();
        } else {
            find(searchRating, "rated");
        }
    }



    return (
        <div className='App'>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Control 
                                    type="text"
                                    placeholder="Search by title"
                                    value={searchTitle} // set to searchTitle state variable
                                    onChange={onChangeSearchTitle}/>
                            </Form.Group>
                            {/* call findByTitle */}
                            <Button
                                variant="primary"
                                type="button"
                                onClick={findByTitle}>
                                Search
                            </Button>      
                        </Col>
                        <Col>
                        <Form.Group>
                            {/* dropdown to select movie rating */}
                            <Form.Control
                                as="select" onChange={onChangeSearchRating}>
                                {ratings.map(rating => {
                                    return(
                                        <option value={rating}>{rating}</option>
                                    );
                                })}
                            </Form.Control>
                        </Form.Group>
                        {/* call findByRating */}
                        <Button
                            variant="primary"
                            type="button"
                            onClick={findByRating}
                        >
                            Search
                        </Button>
                        </Col>
                    </Row>
                </Form>

                <Row>
                    {/* map, for each movie in 'movies' return Card component */}
                    {movies.map((movie) => {
                        return(
                            <Col>
                                <Card style={{ width: '18rem'}}>
                                    <Card.Img src={movie.poster+"/100px180"} />
                                    <Card.Body>
                                        <Card.Title>{movie.title}</Card.Title>
                                        <Card.Text>
                                            Rating: {movie.rated}
                                        </Card.Text>
                                        <Card.Text>{movie.plot}</Card.Text>
                                        <Link to = {"movie/" + movie._id}>View Reviews</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </div>
    );
}

export default MoviesList;

