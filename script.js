let words = "";
let wpm = 60;
let currentIndex = 0;
let isPlaying = false;
let intervalID = null;
//variables and such
const elements = {
    playBtn: document.getElementById('play'),
    menuModal: document.getElementById('menu-modal'),
    pauseBtn: document.getElementById('pause'),
    plusLink: document.getElementById('plus-link'),
    getProModal: document.getElementById('get-pro-modal'),
    upload: document.getElementById('upload'),
    paste: document.getElementById('paste'),
    pasteModal: document.getElementById('paste-modal'),
    aboutModal: document.getElementById('about-modal'),
    aboutLink: document.getElementById('about-link'),
    readBtn: document.getElementById('readBtn'),

    playPause: document.getElementById('play-pause'),
    speedSlider: document.getElementById('speed'),
    scrubSlider: document.getElementById('scrub'),
    wordDisplay: document.getElementById('word'),
    uploadLink: document.getElementById('upload-file'),
    textInput: document.getElementById('paste-text-input')


}

const modalCloseButtons = document.querySelectorAll('.x');

//functions and such
window.onload = function() {
    elements.playBtn.style.display = 'block';
    elements.pauseBtn.style.display = 'none';
    elements.getProModal.style.display = 'none';
    elements.aboutModal.style.display = 'none';
    elements.pasteModal.style.display = 'none';
};

function checkModalStates(modal) {
    console.log(modal.style.display)
    let modals = [
        elements.getProModal,
        elements.aboutModal,
        elements.pasteModal,
        elements.menuModal
    ]
    const index = modals.indexOf(modal);
    modals.splice(index, 1)
    modals.forEach((item)=>{
        item.style.display = 'none';
    })
}

function displayWord(word) {
    elements.wordDisplay.innerText = word;
}

function toggleBtnState(state1, state2) {
    //assuming state 1 is active by default
    if (state2.style.display === 'none') {
        state1.style.display = 'none';
        state2.style.display = 'block';
        isPlaying = true;
    } else {
        state2.style.display = 'none';
        state1.style.display = 'block';
        isPlaying = false;
    }
}

function hideModal(e) {
    const closeX = e.target;
    const modalContent = closeX.parentNode;
    const modal = modalContent.parentNode;
    modal.style.display = 'none';
}


//event listeners and such
elements.playPause.addEventListener('click', ()=>{
    if (elements.aboutModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
        toggleBtnState(elements.playBtn, elements.pauseBtn);
        read(words);
        console.log(isPlaying)
    }
})

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
            toggleBtnState(elements.playBtn, elements.pauseBtn);
            read(words);
    }
    else if (event.code === 'ArrowLeft' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
        currentIndex--
        if (currentIndex < 0) {
            currentIndex = (words.length-1);
        }
        elements.scrubSlider.value = (((currentIndex/words.length)*100))
        read(words);
    }
    else if (event.code === 'ArrowRight' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
        currentIndex++
        if (currentIndex > (words.length-1)) {
            currentIndex = 0;
        }
        elements.scrubSlider.value = (((currentIndex/words.length)*100))
        read(words);
    }
    else if (event.code === 'ArrowUp' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
        wpm = wpm + 25;
        if (wpm > 900) {
            wpm = 900;
        }
        elements.speedSlider.value = wpm;
        read(words);
    }
    else if (event.code === 'ArrowDown' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'none') {
        wpm = wpm - 25;
        if (wpm < 0) {
            wpm = 1;
        }
        elements.speedSlider.value = wpm;
        read(words);
    }
    else if (event.code === 'Enter' && elements.aboutModal.style.display == 'none' && elements.getProModal.style.display == 'none' && elements.menuModal.style.display == 'none' && elements.pasteModal.style.display == 'block') {
        elements.readBtn.click()
    }
});

modalCloseButtons.forEach(button => {
    button.addEventListener('click', hideModal);
});

elements.plusLink.addEventListener('click', () => {
    checkModalStates(elements.getProModal)
    elements.getProModal.style.display = 'block';
})

elements.paste.addEventListener('click', () => {
    elements.pasteModal.style.display = 'block';
    checkModalStates(elements.pasteModal)

})

elements.aboutLink.addEventListener('click', () => {
    elements.aboutModal.style.display = 'block';
    checkModalStates(elements.aboutModal)
})

document.getElementById('upload').addEventListener('click', function() {
    elements.uploadLink.click();
    elements.pasteModal.style.display = 'none';
    elements.menuModal.style.display = 'none';
    elements.aboutModal.style.display = 'none';
    elements.getProModal.style.display = 'none';



});

elements.uploadLink.addEventListener('change', () => {
    const [file] = elements.uploadLink.files;
    const reader = new FileReader();

    reader.addEventListener('load', () => {
        const unfilteredArr = reader.result.trim().split(/[\s\n]+/);
        /*tack stack overflow, mdn och perplexity*/
        let filteredArr = [];
        unfilteredArr.forEach(item => {
            if (item.length > 15) {
                item.length
                filteredArr.push(item.substring(0, Math.min(15, item.length)));
                
            } else {
                filteredArr.push(item);
            }
        });
        words = filteredArr;
        elements.wordDisplay.innerText = words[currentIndex];
        read(words);
    }, false);

    if (file) {
        reader.readAsText(file);
    }
});

elements.speedSlider.addEventListener('input', ()=>{
    wpm = elements.speedSlider.value;
    console.log(wpm);
    read(words);
})

elements.scrubSlider.addEventListener('input', ()=>{
    const indexPC = (elements.scrubSlider.value/100)
    const arrLen = words.length;
    const rawIndex = (indexPC*arrLen);
    const newIndex = Math.round(rawIndex)
    currentIndex = (newIndex)
    console.log(currentIndex)
    read(words);
})

elements.readBtn.addEventListener('click', () => {
    if (elements.textInput.value) {
        const unfilteredArr = elements.textInput.value.trim().split(/[\s\n]+/);
        /*tack stack overflow, mdn och perplexity*/
        let filteredArr = [];
        unfilteredArr.forEach(item => {
            if (item.length > 15) {
                item.length
                filteredArr.push(item.substring(0, Math.min(15, item.length)));
                
            } else {
                filteredArr.push(item);
            }
        });
        words = filteredArr;
        console.log(words);
        elements.wordDisplay.innerText=words[currentIndex];
        elements.pasteModal.style.display = 'none';
        read(words);
    }
})

/*
This function could probably be written 100% more effectively,
if you have a better solution please email us att hello@rapidwords.co
/Elliott
*/

function read(words) {
    if (words) {
        if (currentIndex != words.length) {
            elements.wordDisplay.innerText = words[currentIndex];
        }
        else {
            currentIndex--;
            elements.wordDisplay.innerText = words[currentIndex-1];
        }
        if (isPlaying) {
            clearInterval(intervalID)
            const rate = (60000/wpm)

            intervalID = setInterval(() => {
                console.log(currentIndex)
                currentIndex++;
                if (currentIndex >= words.length) {
                    currentIndex = 0;
                }
                elements.scrubSlider.value = (((currentIndex/words.length)*100))
                elements.wordDisplay.innerText = words[currentIndex];
            },rate)   

        } else {
            clearInterval(intervalID)
        }
    }
    else return
}