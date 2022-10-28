let messages = [];

let messagesContainer = document.querySelector('.messages-container');

let user = prompt('Nome')

fetchMessages()

setInterval(() => {
    fetchMessages();
}, 3000);

function fetchMessages() {
    let api = 'https://mock-api.driven.com.br/api/v6/uol/messages'
    const request = axios.get(api);
    // chamar quandoSucesso para resposta de sucesso da requisição
    request.then(successResponse);
    // chamar quandoErro para resposta de erro da requisiçãodddd
    request.catch(errorResponse);
}

function successResponse(response) {
    messages = response.data;
    printMessages()
}

function errorResponse(response) {
    console.log(response);
}

function printMessages() {
    messagesContainer.innerHTML = '';

    for (let i = 0; i < messages.length; i++) {
        let actualMessage = messages[i];

        if (actualMessage.type === 'status') {
            let toPrint =
                `<li class="message message-join-left">
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

            messagesContainer.innerHTML += toPrint;
        } else if (actualMessage.type === 'message') {
            let toPrint = `
                <li class="message public-message">
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
            messagesContainer.innerHTML += toPrint;
        } else if (actualMessage.type === 'private_message' && actualMessage.to === user){
            let toPrint = 
                `<li class="message private-message">
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
            console.log('chegou reservadamente para você')
            messagesContainer.innerHTML += toPrint;
        } 

        messagesContainer.lastElementChild.scrollIntoView()
    }


}