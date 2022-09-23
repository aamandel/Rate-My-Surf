async function signupFormHandler(event) {
    event.preventDefault();

    // grab values from html by id
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // make a post request to /api/users to add the user to the database
    if (username && email && password) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        // check response status
        if (response.ok) {
            // if account creation was successful, automatically log in new user
            const response = await fetch('/api/users/login', {
                method: 'post',
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                document.location.replace('/');
            } else {
                alert(response.statusText);
            }
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);