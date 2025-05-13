import { Fragment } from "react";
import { List, ListItem, Typography, Divider, Rating } from "@mui/material";

const ReviewList = ({ reviews }) => {
  return (
    <List>
      {reviews.map((review) => (
        <Fragment key={review._id}>
          <ListItem alignItems="flex-start">
            <div>
              <Typography fontWeight="bold">{review.userName}</Typography>
              <Rating value={review.rating} readOnly />
              <Typography>{review.comment}</Typography>
            </div>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default ReviewList;
