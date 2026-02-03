let questions = []
let isLoading = false
let currentCard = 0

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

function updateProgress(){
  const total = questions.length
  const filled = Math.round((currentCard + 1) / total * 100)
  el('progress-fill').style.width = filled + '%'
  el('progress-text').textContent = `${currentCard + 1}/${total}`
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
  updateProgress()
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
    const resultDiv = el('quiz-result')
    resultDiv.innerHTML = `
      <div class="result-score">${data.score}/${data.total}</div>
      <div class="result-percentage">📊 ${data.percentage}% Correct</div>
      <div class="result-message">${getResultMessage(data.percentage)}</div>
    `
    show(resultDiv)
  } catch (err) {
    console.error('Submit error:', err)
    alert('Failed to submit quiz. Please try again.')
  } finally {
    setLoading(btn, false)
  }
}

function getResultMessage(percentage){
  if(percentage === 100) return '🎉 Perfect Score! Outstanding!'
  if(percentage >= 80) return '🌟 Great Job! Well Done!'
  if(percentage >= 60) return '👍 Good Effort! Keep Practicing!'
  if(percentage >= 40) return '💪 Not Bad! Keep Learning!'
  return '📚 Keep Studying! You Got This!'
}

function renderCard(){
  const q = questions[currentCard]
  if(!q) return
  el('question').textContent = q.question
  el('answer').textContent = q.choices[q.answer]
  el('card-counter').textContent = `${currentCard + 1}/${questions.length}`
  const flashcard = el('flashcard-inner')
  flashcard.classList.remove('flipped')
  hide(el('flashcard-back'))
  show(el('flashcard-front'))
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
    hide(el('quiz-result'))
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
  
  // Quiz controls
  el('submit-quiz').addEventListener('click', submitQuiz)
  el('back-quiz').addEventListener('click', goToMenu)
  
  // Study controls
  el('back-study').addEventListener('click', goToMenu)
  el('flashcard-inner').addEventListener('click', ()=>{
    el('flashcard-inner').classList.toggle('flipped')
  })
  el('reveal').addEventListener('click', ()=>{
    el('flashcard-inner').classList.add('flipped')
  })
  el('next-card').addEventListener('click', nextCard)
})
