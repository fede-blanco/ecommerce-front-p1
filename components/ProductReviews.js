import { styled } from "styled-components"
import Input from "./Input.js"
import WhiteBox from "./WhiteBox.js"
import StarsRating from "./StarsRating.js"
import TextArea from "./TextArea.js"
import Button from "./Button.js"
import { useEffect, useState } from "react"
import axios from "axios"
import Spinner from "./Spinner.js"

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 5px;
`
const Subtitle = styled.h3`
  font-size: 1rem;
  margin: 0;
`
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`

const ReviewWrapper = styled.div`
  padding: 10px 0;
  border-top: solid 1px #eee;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
    margin: 3px 0;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #555;
  }
`

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;

  time {
    font-size: 12px;
    font-weight: 500;
    color: #aaa;
    font-family: inherit;
  }
`

const ReviewBody = styled.div`
  font-family: inherit;
  display: flex;
  flex-direction: column;
`

const RatingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;

  div {
    display: flex;
  }
  p {
    margin: 0;
    font-size: 0.7rem;
    align-self: end;
  }
`

export default function ProductReviews({ product }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [stars, setStars] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [productRatingExact, setProductRatingExact] = useState(0)
  const [productRatingRounded, setProductRatingRounded] = useState(0)

  async function submitReview() {
    const data = { title, description, stars, product: product._id }
    await axios.post("/api/reviews", data).then((res) => {
      // alert("ok")
      setTitle("")
      setDescription("")
    })
    loadReviews()
    getRatings()
  }

  function getRatings() {
    const productExactRating = calculateAverageRating(reviews)
    let productRoudedRating = 0
    if(productExactRating){
      if (productExactRating >= 4.5) {
        productRoudedRating = 5
      } else if (productExactRating >= 3.5) {
        productRoudedRating = 4
      } else if (productExactRating >= 2.5) {
        productRoudedRating = 3
      } else if (productExactRating >= 1.5) {
        productRoudedRating = 2
      } else {
        productRoudedRating = 1
      }
    }
    setProductRatingRounded(productRoudedRating)
    if(productExactRating){
      setProductRatingExact(productExactRating)
    } else {
      setProductRatingExact(1);
    }
  }

  function calculateAverageRating(reviews) {
    let totalStars = 0
    reviews.forEach((review) => {
      totalStars += review.stars
    })
    const averageRating = totalStars / reviews.length
    return averageRating
  }

  async function loadReviews() {
    setReviewsLoading(true)
    await axios.get("/api/reviews?product=" + product._id).then((res) => {
      setReviews(res.data)
      setReviewsLoading(false)
    })
  }


  useEffect(() => {
      loadReviews()
  }, [])
  
  useEffect(() => {
    const ratings = getRatings()
  }, [reviews, productRatingExact, productRatingRounded])
  
  return (
    <div>
      <Title>Reviews</Title>
      <ColsWrapper>
        <div>
          <WhiteBox>
            <Subtitle>Add a review</Subtitle>
            <StarsRating onChange={setStars} />
            <Input
              placeholder="Title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <TextArea
              placeholder="Leave us your review!"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            <div>
              <Button primary="true" onClick={submitReview}>
                Submit your review
              </Button>
            </div>
          </WhiteBox>
        </div>
        <div>
          <WhiteBox>
            <RatingWrapper>
              <Subtitle>All reviews</Subtitle>
              {reviewsLoading && <Spinner fullwidth="true" />}
              {!reviewsLoading && reviews.length !== 0 && (
                <>
                  <div style={{ gap: "5px" }}>
                        {productRatingRounded && (
                          <div style={{ display: "flex" }}>
                            <StarsRating
                              disabled="true"
                              defaultHowMany={productRatingRounded}
                              size="lg"
                            />
                            <p>({productRatingExact.toFixed(1)})</p>
                          </div>
                        )}
                  </div>
                </>
              )}
            </RatingWrapper>
            {reviewsLoading && <Spinner fullwidth="true" />}
            {!reviewsLoading && (
              <>
                {reviews.length === 0 && (
                  <p>No reviews yet! You can be the first!</p>
                )}
                {reviews.length > 0 &&
                  reviews.map((review) => (
                    <ReviewWrapper key={review._id}>
                      <ReviewHeader>
                        <StarsRating
                          disabled="true"
                          defaultHowMany={review.stars}
                          size="sm"
                        />
                        <time>
                          {new Date(review.createdAt)
                            .toLocaleString("es-AR", {
                              timeZone: "America/Argentina/Buenos_Aires",
                            })
                            .replace(",", " - ")}
                        </time>
                      </ReviewHeader>
                      <ReviewBody>
                        <h3>{review.title}</h3>
                        <p>{review.description}</p>
                      </ReviewBody>
                    </ReviewWrapper>
                  ))}
              </>
            )}
          </WhiteBox>
        </div>
      </ColsWrapper>
    </div>
  )
}
