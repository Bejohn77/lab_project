let questions = []
let isLoading = false

async function fetchQuestions(){
  try {
    isLoading = true
    const res = await fetch('/api/questions')
    if (!res.ok) throw new Error('Failed to load questions')
    questions = await res.json()
  } catch (err) {
    console.error('Error loading questions:', err)
    alert('Failed to load questions. Please refresh.')
  } finally {
    isLoading = false
  }
}

function el(id){ return document.getElementById(id) }
function show(elem){ elem.classList.remove('hidden') }
function hide(elem){ elem.classList.add('hidden') }
function setLoading(btn, loading){
  btn.disabled = loading
  btn.textContent = loading ? '⟳ Loading...' : btn.dataset.originalText
}

function renderQuiz(){
  const form = el('quiz-form')
  form.innerHTML = ''
  questions.forEach((q,idx) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'question'
    const num = document.createElement('div')
    num.className = 'question-number'
    num.textContent = `Question ${idx + 1} of ${questions.length}`
    wrapper.appendChild(num)
    const title = document.createElement('div')
    title.className = 'question-text'
    title.textContent = q.question
    wrapper.appendChild(title)
    const choicesDiv = document.createElement('div')
    choicesDiv.className = 'choices'
    q.choices.forEach((c,i)=>{
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = 'radio'
      input.name = `q-${q.id}`
      input.value = i
      label.appendChild(input)
      label.appendChild(document.createTextNode(' ' + c))
      choicesDiv.appendChild(label)
    })
    wrapper.appendChild(choicesDiv)
    form.appendChild(wrapper)
  })
}

async function submitQuiz(){
  const btn = el('submit-quiz')
  btn.dataset.originalText = btn.textContent
  try {
    setLoading(btn, true)
    const answers = {}
    questions.forEach(q=>{
      const name = `q-${q.id}`
      const checked = document.querySelector(`input[name="${name}"]:checked`)
      if(checked) answers[String(q.id)] = checked.value
    })
    const res = await fetch('/api/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({answers})
    })
    if (!res.ok) throw new Error('Failed to submit quiz')
    const data = await res.json()
    el('quiz-result').innerHTML = `
      <div style="margin-bottom:12px">Score: ${data.score}/${data.total}</div>
      <div style="font-size:1.5em;color:#10b981">📊 ${data.percentage}%</div>
    `
  } catch (err) {
    console.error('Submit error:', err)
    alert('Failed to submit quiz. Please try again.')
  } finally {
    setLoading(btn, false)
  }
}

let currentCard = 0
function renderCard(){
  const q = questions[currentCard]
  if(!q) return
  el('question').textContent = q.question
  el('answer').textContent = q.choices[q.answer]
  hide(el('answer'))
  document.querySelector('#study-container h2').textContent = `Flashcard Study (${currentCard + 1}/${questions.length})`
}

function nextCard(){
  currentCard = (currentCard + 1) % questions.length
  renderCard()
}

function goToMenu(){
  show(el('menu'))
  hide(el('game'))
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
  
  // Back to menu buttons
  const backBtns = document.querySelectorAll('.back-btn')
  backBtns.forEach(btn => btn.addEventListener('click', goToMenu))
})
