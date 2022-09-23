let upvoteClickHandler = async (event) => {
    event.preventDefault();

    // grab the review id for the upvote from the url
    // /review/3 -> 3
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    const response = await fetch('/api/reviews/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            review_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else if (response.status == 400) {
        alert("You must be logged in to vote");
    } else {
        alert("You have already voted on this review");
    }

}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);