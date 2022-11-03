// Array to store the messages
let messages = [];

// Variable to store the messages container
let messagesContainer = document.querySelector(".messages-container");

// Variable to store the input 
let inputData = document.querySelector("footer input");

// Variable to store the user name
let user = prompt("Qual o seu nome de usuário?");

// Variable to store the correspondent of messages sent
let sendTo = "Todos";

// Call the function to log the user
logIn();

// Get messages every 3 seconds
setInterval(() => {
  fetchMessages();
}, 3000);

// Send request every 5 seconds to stay logged in
setInterval(() => {
  stayLoggedIn();
}, 5000);

// Function to get messages from the API
function fetchMessages() {
    let api = "https://mock-api.driven.com.br/api/v6/uol/messages";

    // Request messages from the API
    const messagesRequest = axios.get(api);

    // If successful: store the messages in an array and then call the printMessages function
    messagesRequest.then((response) => {
        messages = response.data;
        printMessages();
    });

    // If unsuccessful: shows the complete response on the terminal
    messagesRequest.catch((response) => {
        console.log(response);
    });
};

// Function to log the user
function logIn() {
    let logInApi = "https://mock-api.driven.com.br/api/v6/uol/participants ";

    // Post the user data on the server
    const logInRequest = axios.post(logInApi, { name: user });

    // If successful: reload the messages
    logInRequest.then(() => {
        fetchMessages();
    });

    // If unsuccessful: alert the user and reload the page
    logInRequest.catch(() => {
        alert("Nome de usuário inválido ou já em uso, tente novamente com um diferente.");
        window.location.reload();
    });
};

// Function to stay logged
function stayLoggedIn() {
    let logApi = "https://mock-api.driven.com.br/api/v6/uol/status";

    // Post the user data on the server
    const logRequest = axios.post(logApi, { name: user });
};

// Function to send messages
function sendMessage() {
    let messagesApi = "https://mock-api.driven.com.br/api/v6/uol/messages";

    // Try to post the message data on the server
    const messagePost = axios.post(messagesApi, {
        from: user,
        to: sendTo,
        text: inputData.value,
        type: "message", 
    });

    // If successful: delete everything already in the input and reload the messages
    messagePost.then(() => {
        inputData.value = "";
        fetchMessages();
    });

    // If unsuccessful: alert the user and reload the page
    messagePost.catch(() => {
        alert("Erro ao enviar mensagem, a página será recarregada.");
        window.location.reload();
    });
};

// Allows you to use the ENTER key to send messages
inputData.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    };
});

// Function to print messages
function printMessages() {
    // Deletes everything already in the message container
    messagesContainer.innerHTML = "";

    // For to display all the messages
    for (let i = 0; i < messages.length; i++) {
        // Get one message
        let actualMessage = messages[i];

        // Filter and post status messages
        if (actualMessage.type === "status") {
            let toPrint = `
                    <li class="message message-join-left" data-test="message">
                        <p>
                            <span class="message-time">
                                (${actualMessage.time})
                            </span>

                            <span class="message-name">
                                ${actualMessage.from}
                            </span>

                            <span class="message-content">
                                ${actualMessage.text}
                            </span>
                        </p>
                    </li>
            `;

            // Print the message on the screen
            messagesContainer.innerHTML += toPrint;

        // Filter and post public messages
        } else if (actualMessage.type === "message") {
            let toPrint = `
                    <li class="message public-message" data-test="message">
                        <p>
                            <span class="message-time">
                                (${actualMessage.time})
                            </span>

                            <span class="message-name">
                                ${actualMessage.from}
                            </span>

                            <span class="message-to">
                                para
                            </span>

                            <span class="message-name">
                                ${actualMessage.to}:
                            </span>

                            <span class="message-content">
                                ${actualMessage.text}
                            </span>
                        </p>
                    </li>
            `;

            // Print the message on the screen
            messagesContainer.innerHTML += toPrint;

        // Filter and post private messages only if the messages are for the logged user
        } else if (
            actualMessage.type === "private_message" &&
            actualMessage.to === user
        ) {
            let toPrint = `<li class="message private-message" data-test="message">
                        <p>
                            <span class="message-time">
                                (${actualMessage.time})
                            </span>

                            <span class="message-name">
                                ${actualMessage.from}
                            </span>

                            <span class="message-to">
                                reservadamente para
                            </span>

                            <span class="message-name">
                                ${actualMessage.to}:
                            </span>

                            <span class="message-content">
                                ${actualMessage.text}
                            </span>
                        </p>
                    </li>
            `;

            // Print the message on the screen
            messagesContainer.innerHTML += toPrint;
        }

        // Prevents null error when auto scroll is applied
        if (messagesContainer.lastElementChild !== null) {
            messagesContainer.lastElementChild.scrollIntoView();
        }
    }
}
