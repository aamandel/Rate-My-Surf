let reviewFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('textarea[name="review-body"]').value.trim();

    // grab the beach id for the upvote from the url
    // /beach/3 -> 3
    const beach_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (body) {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                title,
                body,
                beach_id,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else if (response.status == 401) {
            alert("You must be logged in to review");
        } else {
            alert(response.status);
        }
    }
}

document.querySelector('.review-submit').addEventListener('click', reviewFormHandler);