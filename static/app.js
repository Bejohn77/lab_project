let questions = []

async function fetchQuestions(){
  const res = await fetch('/api/questions')
  questions = await res.json()
}

function el(id){ return document.getElementById(id) }

function show(elem){ elem.classList.remove('hidden') }
function hide(elem){ elem.classList.add('hidden') }

function renderQuiz(){
  const form = el('quiz-form')
  form.innerHTML = ''
  questions.forEach(q => {
    const wrapper = document.createElement('div')
    wrapper.className = 'question'
    const title = document.createElement('div')
    title.textContent = q.question
    wrapper.appendChild(title)
    q.choices.forEach((c,i)=>{
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = `q-${q.id}`
      input.value = i
      label.appendChild(input)
      label.appendChild(document.createTextNode(' ' + c))
      wrapper.appendChild(label)
    })
    form.appendChild(wrapper)
  })
}

async function submitQuiz(){
  const answers = {}
  questions.forEach(q=>{
    const name = `q-${q.id}`
    const checked = document.querySelector(`input[name="${name}"]:checked`)
    if(checked) answers[String(q.id)] = checked.value
  })
  const res = await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers})})
  const data = await res.json()
  el('quiz-result').textContent = `Score: ${data.score}/${data.total}`
}

let currentCard = 0
function renderCard(){
  const q = questions[currentCard]
  if(!q) return
  el('question').textContent = q.question
  el('answer').textContent = q.choices[q.answer]
  hide(el('answer'))
}

function nextCard(){
  currentCard = (currentCard + 1) % questions.length
  renderCard()
}

// UI wiring
window.addEventListener('DOMContentLoaded', async ()=>{
  await fetchQuestions()
  el('btn-quiz').addEventListener('click', ()=>{
    hide(el('menu'))
    show(el('game'))
    show(el('quiz-container'))
    hide(el('study-container'))
    renderQuiz()
  })
  el('btn-study').addEventListener('click', ()=>{
    hide(el('menu'))
    show(el('game'))
    hide(el('quiz-container'))
    show(el('study-container'))
    currentCard = 0
    renderCard()
  })
  el('submit-quiz').addEventListener('click', submitQuiz)
  el('reveal').addEventListener('click', ()=>show(el('answer')))
  el('next-card').addEventListener('click', nextCard)
})
