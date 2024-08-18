let recapcthaArray = []

let recaptchaHTML = `
    <div class="recaptcha" id="recaptcha-{{recapctha-name}}">
        <input type="checkbox" value="off" id="recaptcha-input-{{recapctha-name}}"></input>
        <div>
            <span>I am not a  robot</span>
        </div>
        <img src="/logo.png" height="30" width="30" alt="logo">
    </div>
`

document.addEventListener('DOMContentLoaded', () => {

    const recaptchas = document.getElementsByTagName("recaptcha")

    for (let i = 0; i < recaptchas.length; i++) {
        let recaptchaName = recaptchas[i].getAttribute("name")
        recaptchas[i].outerHTML = recaptchaHTML.replaceAll('{{recapctha-name}}',recaptchaName)

        recaptchaAddEvent(recaptchaName)
    }

})

function getRecaptcha(name) {
    return document.getElementById(`recaptcha-input-${name}`).checked
    
}

// detect mouse movement
document.addEventListener('mousemove', (e) => {
    let object = {
        x: e.screenX,
        y: e.screenY,
        isTrusted: e.isTrusted,
        moveX: e.movementX,
        moveY: e.movementY
    }

    recapcthaArray.push(object)
})

function recaptchaAddEvent(name) {
    document.getElementById(`recaptcha-input-${name}`).addEventListener('input', (e) => {
        let success = calculateRecaptcha(e)

        if (!success) {
            return alert("false")
        }
    })
}

function calculateRecaptcha(e) {
    if (e.timeStamp < 500) {
        return false;
    }

    let vectors = []

    let lastArray;

    let totalLength = 0

    let flags = 0;

    recapcthaArray.forEach(array => {
        if (lastArray === undefined) {
            lastArray = array
        } else {

            let vector = {x: lastArray.x-array.x, y: lastArray.y-array.y}

            vectors.push(vector)

            lastArray = array
        }
    })

    vectors.forEach(vector => {
        let length = Math.sqrt(Math.pow(vector.x,2)+Math.pow(vector.y,2))

        // let direction = (Math.atan(vector.y/vector.x))*57.2958

        // console.log(direction)

        if (vector.x === 0 || vector.y === 0) {
            if (vector.x > 4 || vector.y > 4) {
                flags++
            } 
        }

        totalLength += length
    })

    if (vectors.length < 5) return false

    if (flags/vectors.length*100 > 10) return false;

    if (totalLength/vectors.length > 50) return false;

    return true;
}

// document.addEventListener('click', (e) => {
//     console.log(e.clientX, e.clientY)
// })