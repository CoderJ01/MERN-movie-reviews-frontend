import React, { useState } from 'react';
import MovieDataService from '../services/movies';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {

    let editing = false;
    let initialReviewState = "";

    // check if state is passed into AddReview
    if(props.location.state && props.location.state.currentReview) {
        editing = true;
        initialReviewState = props.location.state.currentReview.review;
    }

    // true = editing mode, false = adding review
    const [review, setReview] = useState(initialReviewState);
    const [submitted, setSubmitted] = useState(false); // keeps track if review is submmited

    // keep track of whether or not the review is stated
    const onChangeReview = e => {
        const review = e.target.value;
        setReview(review);
    }

    // called by onClick={saveReview}
    const saveReview = () => {
        var data = {
            review: review,
            name: props.user.name,
            user_id: props.user.id,
            movie_id: props.match.params.id // get movie id direct url
        }

        if(editing) {
            // get existing review id
            data.review_id = props.location.state.currentReview._id;
            MovieDataService.updateReview(data)
            .then(response => {
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            })
        }
        else {
            MovieDataService.createReview(data)
            .then(response => {
                setSubmitted(true);
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    return(
        <div>
            {submitted ? (
                <div>
                    <h4>Review submitted successfully</h4>
                    <Link to={"/movies/" + props.match.params.id}>
                        Back to Movie
                    </Link>
                </div>
            ):(
                <Form>
                    <Form.Group>
                        <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                        <Form.Control 
                            type="text"
                            required
                            value={review}
                            onChange={onChangeReview}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={saveReview}>
                        Submit
                    </Button>
                </Form>
            )}
        </div>
    );
}

export default AddReview;