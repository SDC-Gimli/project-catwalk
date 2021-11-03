import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'underscore';

import reviews from '../../../../sample/reviews.js';

import SortReview from './SortReview.jsx';
import ReviewBox from './reviewBox/ReviewBox.jsx';
import AddReview from './bottomButtons/AddReview.jsx';

let id = '40355';

const getReviews = function(id) {
  var urlString = `/api/reviews/?product_id=${id}&count=100`;
  return axios({
    method: 'get',
    url: urlString,
    responseType: 'json'
  });
}

var ReviewList = (props) => {
  const [allReviews, setReviews] = useState(null);
  const [display, setDisplay] = useState(2);
  const [sortBy, setSort] = useState('date');

  useEffect(() => {
    getReviews(id)
      .then(res => {
        // console.log('reviews data:', res.data);
        let reviewsData = res.data.results;
        let current = moment().startOf('day');
        for (var i = 0; i < reviewsData.length; i++) {
          let dateOfReview = moment(reviewsData[i].date, "YYYY-MM-DD");
          let dateDiff = current.diff(dateOfReview, 'days');
          reviewsData[i].dateDiff = dateDiff;
          reviewsData[i].helpful = reviewsData[i].helpfulness * -1;
        }

        setReviews(_.sortBy(reviewsData, sortBy));
      })
  }, [])

  useEffect(() => {
    setReviews(_.sortBy(allReviews, sortBy));
  }, [sortBy]);

  const clickMoreReviews = (e) => {
    e.preventDefault();
    setDisplay(display + 2);
  }

  const changeSort = (sortMethod) => {
    setSort(sortMethod);
  }
  // console.log('current state reviews:', allReviews);
  // console.log('sample data reviews:', reviews);

  if (allReviews !== null) {


    return (
      <div className="review-list">
        <SortReview reviews={allReviews} changeSort={changeSort.bind(this)}/>
        <ReviewBox display={display} reviews={allReviews}/>
        <div className="review-bottom-buttons">
          {
            allReviews.length > 2 &&
            <div id="more-review">
              <button id="more-review-btn" className="more-and-add-reviews-btn"
                onClick={clickMoreReviews}>
                MORE REVIEWS
              </button>
            </div>
          }

          <AddReview />
        </div>

      </div>
    )
  } else {
    return (
      <div>
        Loading reviews...
      </div>
    )
  }
};

export default ReviewList;