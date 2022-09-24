let commentFormHandler = async (event) => {
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();

    // grab the review id for the upvote from the url
    // /review/3 -> 3
    const review_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                review_id,
                comment_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else if (response.status == 401) {
            alert("You must be logged in to comment");
        } else {
            alert(response.status);
        }
    }
}

document.querySelector('.comment-submit').addEventListener('click', commentFormHandler);