var loginScreen = document.querySelector('#loginScreen');
var messageScreen = document.querySelector('#messageScreen');
var userScreen = document.querySelector('#userScreen');
var profileScreen = document.querySelector('#profileScreen');

var navPills = document.querySelector('#navPills');
var messagePill = document.querySelector('#messagePill');
var userPill = document.querySelector('#userPill');
var profilePill = document.querySelector('#profilePill');
var logoutPill = document.querySelector('#logoutPill');

getUsers();

messagePill.addEventListener('click', messageFunction);

function messageFunction() {
     console.log(messageScreen);
    messagePill.classList.add('active');
    profilePill.classList.remove('active');
    userPill.classList.remove('active');
    messageScreen.classList.remove('hidden')
    userScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
}

userPill.addEventListener('click', userFunction)

function userFunction() {
    console.log(userScreen);
    messagePill.classList.remove('active');
    profilePill.classList.remove('active');
    userPill.classList.add('active');
    messageScreen.classList.add('hidden')
    userScreen.classList.remove('hidden');
    profileScreen.classList.add('hidden');
}

profilePill.addEventListener('click', profileFunction)

function profileFunction() {
    console.log(profileScreen);
    console.log('currentUser ' + userNameValue);
    otherUser = userNameValue;
    getUserMessages();
    messagePill.classList.remove('active');
    profilePill.classList.add('active');
    userPill.classList.remove('active');
    messageScreen.classList.add('hidden')
    userScreen.classList.add('hidden');
    profileScreen.classList.remove("hidden");
}

function otherProfileFunction() {
    messageScreen.classList.add('hidden')
    userScreen.classList.add('hidden');
    profileScreen.classList.remove("hidden");
}

logoutPill.addEventListener('click', logoutFunction);

function logoutFunction() {
    sessionStorage.clear();

    messagePill.classList.add('active');
    profilePill.classList.remove('active');
    userPill.classList.remove('active');
    loginScreen.classList.remove('hidden');
    messageScreen.classList.add('hidden')
    userScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
    navPills.classList.add('hidden');


    var fullNameValue = '';
    var userNameValue = '';
    var passwordValue = '';
    var confirmPasswordValue = '';
    var avatarValue = '';

}

// Login/Register logic

var fullName = document.querySelector('#name').parentNode;
var userName = document.querySelector('#username').parentNode;
var password = document.querySelector('#password').parentNode;
var confirmPassword = document.querySelector('#confirmPassword').parentNode;
var avatar = document.querySelector('#avatar').parentNode;
var isLogin = true;

var fullNameValue = '';
var userNameValue = '';
var passwordValue = '';
var confirmPasswordValue = '';
var avatarValue = '';

var actionButton = document.querySelector('#actionButton');
var actionLink = document.querySelector('#actionLink');

actionLink.addEventListener('click', showConfirmPassword);
actionButton.addEventListener('click', useActionButton);

function showConfirmPassword() {
    // if (actionLink.innerText === 'Sign Up') {
    if (isLogin) {
        confirmPassword.classList.remove('hidden');
        fullName.classList.remove('hidden');
        avatar.classList.remove('hidden');
        actionButton.innerText = 'Sign Up';
        actionLink.innerText = 'Sign In';
        isLogin = false;
    }
    else if (!isLogin) {
        confirmPassword.classList.add('hidden');
        fullName.classList.add('hidden');
        avatar.classList.add('hidden');
        actionButton.innerText = 'Sign In';
        actionLink.innerText = "Sign Up"
        isLogin = true;
    }
}

function useActionButton() {
    fullNameValue = document.querySelector('#name').value;
    userNameValue = document.querySelector('#username').value;
    passwordValue = document.querySelector('#password').value;
    confirmPasswordValue = document.querySelector('#confirmPassword').value;
    avatarValue = document.querySelector('#avatar').value;

    if (isLogin) {
        login();
    } else if (!isLogin) {
        register();
    }
}

function register() {
    console.log(`Full Name: ${fullNameValue} Username: ${userNameValue} Password: ${passwordValue} Confirm Password: ${confirmPasswordValue} AvatarURL: ${avatarValue}`);
    
    if (passwordValue === confirmPasswordValue) {
        fetch('https://nameless-anchorage-55016.herokuapp.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            name: fullNameValue,
            username: userNameValue,
            password: passwordValue,
            avatar: avatarValue,
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response.api_token);

            if (response.api_token) {
                sessionStorage.setItem('token', response.api_token);
                location.href = 'profile.html';
            }
            else {
                // alert('There was an error. Check out your console.');
                alert('User has been registered. Please sign in');
                document.querySelector('#name').value = '';
                document.querySelector('#username').value = '';
                document.querySelector('#password').value = '';
                document.querySelector('#confirmPassword').value = '';
                document.querySelector('#avatar').value = '';
                showConfirmPassword();
                console.log(response);
            }
        })
    } else {
        alert('Your passwords must match');
    }

}

function login() {
    console.log(`Username: ${userNameValue} Password: ${passwordValue}`);
    fetch('https://nameless-anchorage-55016.herokuapp.com/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            username: userNameValue,
            password: passwordValue,
        })
    })
        .then(function(response) {
            console.log(response.json);
            return response.json();
        })
        .then(function(response) {
            console.log('response ' + response);

            if (response.api_token) {
                sessionStorage.setItem('token', response.api_token);
                messageScreen.classList.remove('hidden');
                loginScreen.classList.add('hidden');
                navPills.classList.remove('hidden');
            }
            else {
                alert('There was an error. Check out your console.');
                console.log('error response: ' + response);
            }
        })
}




// Messages logic

document.querySelector('#postButton').addEventListener('click', sendMessage);

getMessages();

function getMessages() {
    document.querySelector('#messageList').innerHTML = '';
    var token = sessionStorage.getItem('token');

    fetch('https://nameless-anchorage-55016.herokuapp.com/posts')
    .then(function(response) {
        return response.json();
        console.log(response);
    })
    .then(function(response) {
        renderMessagesList(response);
        document.querySelector('#postMessage').value = '';

    })
}

function renderMessagesList(messages) {
    console.log(messages);

    messages.forEach(createMessage);
}

function createMessage(message) {
    var messageListItem = `<li class="list-group-item">
                            <div class="row">
                            <div class="col-sm-2">
                                <img id="avatarImage" src="http://robohash.org/winter"/>
                                <div class="otherUsername">${message.user.username}</div>
                            </div>
                            <div class="userListItem otherChirp col-sm-10">
                                ${message.body}
                            </div>
                        </li>`
    var currentMessagesHTML = document.querySelector('#messageList').innerHTML;

    document.querySelector('#messageList').innerHTML = messageListItem + currentMessagesHTML;
}

function sendMessage() {
    var message = document.querySelector('#postMessage').value;
    var token = sessionStorage.getItem('token');

    console.log("message " + message);

    // document.querySelector('#postMessage').value = '';

    fetch('https://nameless-anchorage-55016.herokuapp.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        // Back-end controls the left side, properties, of this object
        // Front-end controls the variables names and values on the right side
        body: JSON.stringify({
            body: message,
            // user:  user,
            api_token: token
        })
    })
        .then(function(response) {
            console.log(response.json);
            return response.json();
        })
        .then(function(response) {
            console.log(response);

            alert('message was posted');
            getMessages();
        })
}



// Users logic

var otherUser;

function getUsers() {
    var token = sessionStorage.getItem('token');

    fetch('https://nameless-anchorage-55016.herokuapp.com/users')
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        renderUsersList(response);
        console.log('response' + response)
    })
}

function renderUsersList(users) {
    console.log(users);

    users.forEach(function(user) {
        var userListItem = `<li class="list-group-item">
                            <div class="userListItem">
                                 <span class="userName">${user.username}</span>
                                <span class="glyphicon glyphicon-plus pull-right" id="notFollowing" aria-hidden="true"></span>
                                <span class="glyphicon glyphicon-minus pull-right hidden" id="following" aria-hidden="true"></span>
                            </div>
                        </li>`;

        document.querySelector('#userList').innerHTML += userListItem;
    });
}

document.querySelector('#userList').addEventListener('click', function(e){
  otherUser = e.target.innerText;
    otherProfileFunction();
    getUserMessages();
    console.log(otherUser);
});

function getUserMessages() {
    document.querySelector('#profileUsername').innerText = otherUser;
    document.querySelector('#profileMessageList').innerHTML = '';

    var token = sessionStorage.getItem('token');

    fetch('https://nameless-anchorage-55016.herokuapp.com/posts')
    .then(function(response) {
        return response.json();
        console.log(response);
    })
    .then(function(response) {
        renderUserMessagesList(response);

    })
}

function renderUserMessagesList(messages) {
    console.log(messages);

    messages.forEach(createUserMessage);
}

function createUserMessage(message) {

    if (message.user.username === otherUser) {
    var userMessageListItem = `<li class="list-group-item">
                            <div class="row">
                            <div class="col-sm-2">
                                <img id="avatarImage" src="http://robohash.org/winter"/>
                                <div class="otherUsername">${message.user.username}</div>
                            </div>
                            <div class="userListItem otherChirp col-sm-10">
                                ${message.body}
                            </div>
                        </li>`
    var currentUserMessagesHTML = document.querySelector('#profileMessageList').innerHTML;

    document.querySelector('#profileMessageList').innerHTML = userMessageListItem + currentUserMessagesHTML;
    }
}