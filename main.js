const mitt = require('mitt')()
const sse_requests = {}

function removeOldSSEBox(document) {
    const oldBox = document.getElementById('sse-response-box')
    if(oldBox !== null) oldBox.getElementsByTagName('button')[0].click()
}

function createSSEBox(document, source) {
    const overlay = document.querySelector('.response-pane .overlay')
    overlay.style = 'display: None'

    const sseResponseNode = document.createElement('div')
    sseResponseNode.id = 'sse-response-box'
    sseResponseNode.style = 'position: relative;padding: 10px; overflow-y: scroll;background-color: #FFFFFF10'
    const cleanButton = document.createElement('button')
    cleanButton.innerText = 'Stop Streaming'
    cleanButton.style = 'position: absolute;top: 10px; right: 10px;border: 1px solid rgb(187, 187, 187);padding: 5px'
    cleanButton.addEventListener('click', event => {
        sseResponseNode.parentNode.removeChild(sseResponseNode)
        source.close()
    })
    sseResponseNode.appendChild(cleanButton)

    const responseTabs = document.querySelector('[aria-label="Response pane tabs"]')
    responseTabs.parentNode.insertBefore(sseResponseNode, responseTabs.nextSibling)

    return sseResponseNode
}

module.exports.requestHooks = [
  async context => {
    if(context.request.getMethod() === 'SSE') {
        removeOldSSEBox(document)

        let source = new EventSource(context.request.getUrl())
        const sseBox = createSSEBox(document, source)
        let eventName = context.request.getHeader('x-event-name')

        source.onopen = function(e) {
            console.log(e)
        }

        let messageCallback = (message) => {
            const messageNode = document.createElement('div')
            messageNode.innerText = message.data
            messageNode.style = 'margin: 5px 0px;'
            sseBox.prepend(messageNode)
        }

        sse_requests[context.request.getId()] = {
            source: source,
            box: sseBox
        }
        source.addEventListener(eventName ?? 'sse', messageCallback)
    }
  }
];

module.exports.responseHooks = [
  async context => {
    const req = context.response.getRequestId()
    if(sse_requests.hasOwnProperty(req)) {
        const sse_request = sse_requests[req]

        mitt.on('test-sse', (event) => {
            const messageNode = document.createElement('div')
            messageNode.innerText = JSON.stringify(event)
            messageNode.style = 'margin: 5px 0px;'
            sse_request.box.prepend(messageNode)
        })
    }
  }
];