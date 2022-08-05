import React, {useState, useEffect} from 'react';
import MovieDataService from '../services/movies';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
// import Media from 'react-bootstrap/Media';

const Movie = props => {

    // hold specific movie being shown
    const [movie, setMovie] = useState({
        id: null,
        title: "",
        rated: "",
        reviews:[]
    });

    // call MovieDataService.get()
    const getMovie = id => {
        MovieDataService.get(id)
            .then(response => {
                setMovie(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    // call getMovie
    useEffect(() => {
        getMovie(props.match.params.id)
    }, [props.match.params.id] /* avoid calling multiple times for same movie*/)

    const deleteReview = (reviewId, index) => {
        MovieDataService.deleteReview(reviewId, props.user.id)
            // get reviews array
            .then(response => {
                setMovie((prevState) => {
                    // provide index of review to be deleted
                    prevState.reviews.splice(index, 1);
                    return({
                        // set updated reviews array as the state
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e);
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    {/* movie poster */}
                    <Col>
                        <Image src={movie.poster+ "/100px250"} fluid />
                    </Col>
                    {/* movie details */}
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                </Card.Text>
                                {props.user && 
                                <Link to={"/movies/" + props.match.params.id + "/review"}>
                                    Add Review
                                </Link>}
                            </Card.Body>
                        </Card>
                        <br></br>
                        {/* access reviews array */}
                        {movie.reviews.map((review, index) => {
                            return (
                                <Card key={index}>
                                    <Card.Body>
                                        <h5>{review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}</h5>
                                        <p>{review.review}</p>
                                        {props.user && props.user.id === review.user_id &&
                                        <Row>
                                            <Col><Link to={{
                                                pathname: "/movies/" + 
                                                    props.match.params.id +
                                                    "review",
                                                state: {currentReview: review}
                                            }}>Edit</Link>
                                            </Col>
                                            <Col>
                                                <Button variant="link" onClick={() => deleteReview(review._id, index)}>
                                                    Delete
                                                </Button>
                                            </Col>
                                        </Row>
                                        }
                                    </Card.Body>
                                </Card>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Movie;