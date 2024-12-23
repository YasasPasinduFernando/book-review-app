import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Edit, Trash2 } from "lucide-react";

const BookReviewApp = () => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = () => {
    if (review.trim()) {
      setReviews([...reviews, review]);
      setReview(""); // Clear input
    }
  };

  return (
    <div className="p-4">
      <Alert>
        <AlertDescription>Welcome to the Book Review App!</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts about the book..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleReviewSubmit}>Submit</Button>
        </CardFooter>
      </Card>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Reviews:</h2>
        {reviews.map((item, index) => (
          <Card key={index} className="mb-2">
            <CardContent>{item}</CardContent>
            <CardFooter>
              <Button className="mr-2">
                <Edit size={16} /> Edit
              </Button>
              <Button className="mr-2">
                <Trash2 size={16} /> Delete
              </Button>
              <Button>
                <Star size={16} /> Rate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookReviewApp;
